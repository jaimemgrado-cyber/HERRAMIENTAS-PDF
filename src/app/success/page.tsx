import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago completado",
  robots: { index: false, follow: false },
};

/**
 * IMPORTANTE: esta página es solo un mensaje de cortesía. El acceso PRO
 * real (cuando exista un sistema de cuentas) debe activarse únicamente a
 * partir de la confirmación del webhook de Stripe (ver
 * /api/stripe/webhook), nunca por el simple hecho de que el usuario haya
 * llegado a esta URL.
 */
export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">¡Gracias por tu suscripción!</h1>
      <p className="mt-3 text-ink-soft">
        Tu pago se ha procesado correctamente con Stripe. Recibirás un email de confirmación con
        los detalles de tu suscripción PDF Pro.
      </p>
      <Link
        href="/tools"
        className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
      >
        Ir a las herramientas
      </Link>
    </div>
  );
}
