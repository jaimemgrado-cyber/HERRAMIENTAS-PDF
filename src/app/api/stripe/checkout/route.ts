import { NextResponse } from "next/server";
import { stripe, STRIPE_PRO_PRICE_ID } from "@/lib/stripe";

/**
 * Crea una sesión de Stripe Checkout para suscribirse al plan PDF Pro.
 *
 * Esta primera versión NO requiere cuenta de usuario: Stripe Checkout
 * recoge el email del cliente directamente en su formulario hospedado, y
 * el pago se procesa íntegramente en la infraestructura de Stripe (no
 * gestionamos ni almacenamos datos de tarjeta en nuestro servidor).
 *
 * Cuando se añada un sistema de cuentas (ver README → "Próximos pasos"),
 * esta ruta debe:
 *   1. Asociar/crear un Stripe Customer ligado al usuario autenticado.
 *   2. Guardar el customerId y el estado de la suscripción en base de
 *      datos a partir de los eventos del webhook (ver /api/stripe/webhook),
 *      para que el acceso PRO se determine siempre en servidor y nunca
 *      confiando en el cliente.
 */
export async function POST() {
  if (!STRIPE_PRO_PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe no está configurado todavía (falta STRIPE_PRO_PRICE_ID)." },
      { status: 503 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe:checkout] Error creando la sesión", err);
    return NextResponse.json(
      { error: "No se ha podido iniciar el pago. Inténtalo de nuevo en unos minutos." },
      { status: 500 }
    );
  }
}
