import Stripe from "stripe";

// Este módulo solo debe importarse desde código de servidor
// (API routes / server actions). STRIPE_SECRET_KEY nunca debe llegar
// al bundle del cliente: Next.js ya evita esto porque no tiene el
// prefijo NEXT_PUBLIC_, pero además evitamos importar este archivo
// desde ningún componente cliente.

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  // No lanzamos en build/dev para no romper `next build` sin claves,
  // pero avisamos claramente en producción si falta la configuración.
  // eslint-disable-next-line no-console
  console.warn("[stripe] STRIPE_SECRET_KEY no está configurada.");
}

// Valor de repliegue deliberadamente inválido (no sigue el patrón sk_test_/sk_live_
// de Stripe) para que ningún escáner de secretos lo confunda con una clave real.
// Solo se usa si STRIPE_SECRET_KEY no está definida; cualquier llamada real a la
// API de Stripe fallará con un error claro hasta que configures la variable.
export const stripe = new Stripe(secretKey ?? "MISSING_STRIPE_SECRET_KEY", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";

/** Eventos de webhook que la aplicación gestiona. Ver /api/stripe/webhook. */
export const HANDLED_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
] as const;
