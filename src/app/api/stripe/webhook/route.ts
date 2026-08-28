import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Endpoint de webhook de Stripe — única fuente de verdad que actualiza
 * `profiles.plan` en Supabase. Nunca se concede acceso PRO desde el
 * cliente ni desde la URL de retorno de Checkout (/success): solo desde
 * aquí, tras verificar la firma de Stripe.
 *
 * Usa el cliente ADMIN (service_role) porque este endpoint no tiene
 * sesión de usuario (lo llama Stripe, no el navegador) — es el único
 * archivo del proyecto que debe importar
 * src/lib/supabase/admin.ts.
 *
 * plan se deriva SIEMPRE del estado real de la suscripción en Stripe:
 * 'pro' solo si status es 'active' o 'trialing'; cualquier otro estado
 * (canceled, unpaid, past_due, incomplete_expired...) => 'free'.
 */

function planFromStripeStatus(status: Stripe.Subscription.Status): "free" | "pro" {
  return status === "active" || status === "trialing" ? "pro" : "free";
}

async function findUserId(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  params: { userIdFromMetadata?: string | null; customerId: string }
): Promise<string | null> {
  if (params.userIdFromMetadata) return params.userIdFromMetadata;

  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", params.customerId)
    .maybeSingle();

  return data?.id ?? null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const admin = createSupabaseAdminClient();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const userId = await findUserId(admin, {
    userIdFromMetadata: subscription.metadata?.user_id,
    customerId,
  });

  if (!userId) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] No se encontró perfil de Supabase para la suscripción",
      subscription.id,
      "customer:",
      customerId
    );
    return;
  }

  const plan = planFromStripeStatus(subscription.status);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

  const { error } = await admin
    .from("profiles")
    .update({
      plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_end: currentPeriodEnd,
    })
    .eq("id", userId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[stripe:webhook] Error actualizando profiles", error);
  }
}

async function markSubscriptionDeleted(subscription: Stripe.Subscription) {
  const admin = createSupabaseAdminClient();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const userId = await findUserId(admin, {
    userIdFromMetadata: subscription.metadata?.user_id,
    customerId,
  });
  if (!userId) return;

  const { error } = await admin
    .from("profiles")
    .update({
      plan: "free",
      subscription_status: "canceled",
    })
    .eq("id", userId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[stripe:webhook] Error marcando suscripción como cancelada", error);
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma del webhook." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    // Verificación de firma: rechaza cualquier petición que no venga
    // realmente firmada por Stripe con nuestro secreto.
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe:webhook] Firma inválida", err);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.subscription) {
          const subscriptionId =
            typeof checkoutSession.subscription === "string"
              ? checkoutSession.subscription
              : checkoutSession.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await markSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.paid": {
        // El estado autorizado de la suscripción llega vía
        // customer.subscription.updated; aquí no hace falta acción extra.
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const admin = createSupabaseAdminClient();
          const userId = await findUserId(admin, { customerId });
          if (userId) {
            // No degradamos el plan aquí directamente: Stripe también
            // envía customer.subscription.updated con status "past_due",
            // que es quien realmente decide el plan (ver
            // planFromStripeStatus). Aquí solo dejamos constancia.
            // eslint-disable-next-line no-console
            console.info("[stripe:webhook] Pago fallido para el usuario", userId);
            // TODO: enviar email transaccional de "pago fallido" (ver
            // EMAIL_* en .env.example).
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe:webhook] Error procesando evento", event.type, err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
