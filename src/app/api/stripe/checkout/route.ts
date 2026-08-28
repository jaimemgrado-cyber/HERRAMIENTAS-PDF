import { NextResponse } from "next/server";
import { stripe, STRIPE_PRO_PRICE_ID } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Crea una sesión de Stripe Checkout para suscribirse al plan PDF Pro.
 *
 * Requiere un usuario autenticado (Supabase Auth). Reutiliza el
 * stripe_customer_id guardado en profiles si ya existe; si no, crea un
 * nuevo Stripe Customer y lo asocia al perfil mediante la función RPC
 * `set_stripe_customer_id` (SECURITY DEFINER, ver
 * supabase/migrations/0001_init.sql) — así no hace falta la service_role
 * key en esta ruta, solo la sesión del propio usuario.
 *
 * El acceso PRO real nunca se concede aquí: solo se activa cuando el
 * webhook de Stripe confirma el pago (ver /api/stripe/webhook).
 */
export async function POST() {
  if (!STRIPE_PRO_PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe no está configurado todavía (falta STRIPE_PRO_PRICE_ID)." },
      { status: 503 }
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para suscribirte a PDF Pro." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    let customerId = profile?.stripe_customer_id ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      // Escritura permitida por la función RPC (comprueba auth.uid() por
      // dentro), sin necesitar la service_role key en esta ruta.
      const { error: rpcError } = await supabase.rpc("set_stripe_customer_id", {
        p_customer_id: customerId,
      });
      if (rpcError) {
        // eslint-disable-next-line no-console
        console.error("[stripe:checkout] No se pudo guardar stripe_customer_id", rpcError);
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: { user_id: user.id },
      subscription_data: {
        metadata: { user_id: user.id },
      },
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
