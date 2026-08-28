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
 * archivo del proyecto que debe importar src/lib/supabase/admin.ts.
 *
 * plan se deriva SIEMPRE del estado real de la suscripción en Stripe:
 * 'pro' solo si status es 'active' o 'trialing'; cualquier otro estado
 * (canceled, unpaid, past_due, incomplete_expired...) => 'free'.
 *
 * IMPORTANTE (lección de un bug real): un `update()` de Supabase que no
 * encuentra ninguna fila que coincida con el `.eq(...)` NO se considera un
 * error — devuelve éxito con cero filas afectadas. Si no se comprueba
 * explícitamente cuántas filas se han modificado, un fallo silencioso
 * (userId incorrecto, restricción UNIQUE violada, etc.) se disfraza de
 * éxito: el webhook respondería 200 a Stripe sin haber escrito nada, y
 * Stripe dejaría de reintentar el evento al darlo por entregado. Por eso
 * cada escritura aquí usa `.select().maybeSingle()` para confirmar que
 * realmente se modificó una fila, y devuelve 500 (para que Stripe
 * reintente) si no es así.
 */

function planFromStripeStatus(
  status: Stripe.Subscription.Status
): "free" | "pro" {
  return status === "active" || status === "trialing" ? "pro" : "free";
}

/** Resultado de intentar averiguar a qué perfil de Supabase pertenece una suscripción. */
interface ResolvedUser {
  userId: string;
  source: "metadata" | "stripe_customer_id_lookup";
}

async function findUserId(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  params: { userIdFromMetadata?: string | null; customerId: string }
): Promise<ResolvedUser | null> {
  if (params.userIdFromMetadata) {
    return {
      userId: params.userIdFromMetadata,
      source: "metadata",
    };
  }

  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", params.customerId)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] Error buscando perfil por stripe_customer_id",
      error
    );
    return null;
  }

  return data
    ? {
        userId: data.id,
        source: "stripe_customer_id_lookup",
      }
    : null;
}

/**
 * Actualiza profiles y devuelve true SOLO si una fila real se ha
 * modificado. `.select().maybeSingle()` obliga a PostgREST a devolver la
 * fila actualizada (o null si no coincidió ninguna), en vez de un simple
 * "ok" sin información de filas afectadas.
 */
async function updateProfileVerified(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
  patch: Record<string, unknown>
): Promise<boolean> {
  const { data, error } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] Error de Postgres actualizando profiles",
      {
        userId,
        patch,
        error,
      }
    );
    return false;
  }

  if (!data) {
    // Esto es la parte que antes pasaba desapercibida: ningún error, pero
    // tampoco ninguna fila coincidía con ese id.
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] update() no ha encontrado ninguna fila en profiles con ese id " +
        "(0 filas afectadas, sin error de Postgres) — revisa que este userId exista " +
        "realmente en la tabla profiles.",
      {
        userId,
        patch,
      }
    );
    return false;
  }

  return true;
}

async function syncSubscription(
  subscription: Stripe.Subscription
): Promise<boolean> {
  const admin = createSupabaseAdminClient();

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const resolved = await findUserId(admin, {
    userIdFromMetadata: subscription.metadata?.user_id,
    customerId,
  });

  if (!resolved) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] No se encontró perfil de Supabase para la suscripción",
      subscription.id,
      "customer:",
      customerId,
      "— ni subscription.metadata.user_id ni una fila con ese stripe_customer_id existen."
    );
    return false;
  }

  const plan = planFromStripeStatus(subscription.status);

  const currentPeriodEnd = new Date(
    subscription.current_period_end * 1000
  ).toISOString();

  const ok = await updateProfileVerified(admin, resolved.userId, {
    plan,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    current_period_end: currentPeriodEnd,
  });

  if (!ok) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] syncSubscription: la escritura NO se ha confirmado",
      {
        subscriptionId: subscription.id,
        userId: resolved.userId,
        resolvedVia: resolved.source,
      }
    );
  }

  return ok;
}

async function markSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<boolean> {
  const admin = createSupabaseAdminClient();

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const resolved = await findUserId(admin, {
    userIdFromMetadata: subscription.metadata?.user_id,
    customerId,
  });

  if (!resolved) return false;

  return updateProfileVerified(admin, resolved.userId, {
    plan: "free",
    subscription_status: "canceled",
  });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook no configurado." },
      { status: 503 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Falta la firma del webhook." },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    // Verificación de firma: rechaza cualquier petición que no venga
    // realmente firmada por Stripe con nuestro secreto.
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe:webhook] Firma inválida", err);

    return NextResponse.json(
      { error: "Firma inválida." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession =
          event.data.object as Stripe.Checkout.Session;

        if (!checkoutSession.subscription) {
          // eslint-disable-next-line no-console
          console.info(
            "[stripe:webhook] checkout.session.completed sin subscription asociada (¿evento de prueba del Dashboard?), se ignora."
          );
          break;
        }

        const subscriptionId =
          typeof checkoutSession.subscription === "string"
            ? checkoutSession.subscription
            : checkoutSession.subscription.id;

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        const ok = await syncSubscription(subscription);

        if (!ok) {
          return NextResponse.json(
            {
              error:
                "No se ha podido sincronizar el perfil de Supabase.",
            },
            { status: 500 }
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const ok = await syncSubscription(subscription);

        if (!ok) {
          return NextResponse.json(
            {
              error:
                "No se ha podido sincronizar el perfil de Supabase.",
            },
            { status: 500 }
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const ok = await markSubscriptionDeleted(subscription);

        if (!ok) {
          return NextResponse.json(
            {
              error:
                "No se ha podido marcar la suscripción como cancelada.",
            },
            { status: 500 }
          );
        }

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
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          const admin = createSupabaseAdminClient();

          const resolved = await findUserId(admin, {
            customerId,
          });

          if (resolved) {
            // No degradamos el plan aquí directamente: Stripe también
            // envía customer.subscription.updated con status "past_due",
            // que es quien realmente decide el plan.
            // eslint-disable-next-line no-console
            console.info(
              "[stripe:webhook] Pago fallido para el usuario",
              resolved.userId
            );

            // TODO: enviar email transaccional de "pago fallido"
            // (ver EMAIL_* en .env.example).
          }
        }

        break;
      }

      default:
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe:webhook] Error procesando evento",
      event.type,
      err
    );

    return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
