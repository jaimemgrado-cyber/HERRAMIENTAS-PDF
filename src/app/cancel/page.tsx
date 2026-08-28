import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago cancelado",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Pago cancelado</h1>
      <p className="mt-3 text-ink-soft">
        No se ha completado el pago. Puedes intentarlo de nuevo cuando quieras desde la página de
        precios.
      </p>
      <Link
        href="/pricing"
        className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
      >
        Volver a precios
      </Link>
    </div>
  );
}
