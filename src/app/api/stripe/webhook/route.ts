import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Endpoint de webhook de Stripe.
 *
 * En esta versión SIN base de datos, el webhook verifica la firma (paso de
 * seguridad imprescindible) y registra el evento recibido. Cuando se
 * conecte una base de datos, este es el único lugar donde debe activarse o
 * revocarse el acceso PRO de un usuario: nunca confiar en el navegador ni
 * en la URL de retorno de Checkout (ver /success) para conceder acceso.
 *
 * Eventos gestionados (ver README para cómo suscribirlos en el Dashboard
 * de Stripe): checkout.session.completed, customer.subscription.created,
 * customer.subscription.updated, customer.subscription.deleted,
 * invoice.paid, invoice.payment_failed.
 */
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

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "invoice.paid":
    case "invoice.payment_failed": {
      // TODO: cuando exista base de datos de usuarios, sincronizar aquí
      // el estado real de la suscripción (plan, estado, fecha de
      // renovación) asociado al customer/usuario correspondiente.
      // eslint-disable-next-line no-console
      console.info(`[stripe:webhook] Evento recibido: ${event.type}`, event.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
