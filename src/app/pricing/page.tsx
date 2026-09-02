import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PricingCard from "@/components/PricingCard";
import { PLAN_LIMITS, PRO_PRICE_DISPLAY } from "@/lib/plan-limits";

export const metadata: Metadata = {
  title: "Precios",
  description: "Compara el plan gratuito y el plan Pro de PDF Tools.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Precios", href: "/pricing" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Precios</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Empieza gratis y actualiza a Pro cuando necesites más capacidad y una experiencia sin anuncios.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PricingCard
          name="Free"
          price="0 €"
          features={[
            "Herramientas básicas",
            `Archivos de hasta ${PLAN_LIMITS.free.maxFileSizeMB} MB`,
            `${PLAN_LIMITS.free.dailyOperations} operaciones al día`,
            "Con publicidad",
          ]}
          ctaLabel="Empezar gratis"
          ctaHref="/tools"
        />
        <PricingCard
          name="Pro"
          price={PRO_PRICE_DISPLAY.split("/")[0]?.trim() ?? "4,99 €"}
          highlighted
          features={[
            "Sin anuncios",
            `Archivos de hasta ${PLAN_LIMITS.pro.maxFileSizeMB} MB`,
            `${PLAN_LIMITS.pro.dailyOperations} operaciones al día`,
            "Procesamiento por lotes (cuando esté disponible)",
          ]}
          ctaLabel="Hazte Pro"
          checkoutEndpoint="/api/stripe/checkout"
        />
      </div>

      <p className="mt-8 text-xs text-ink-soft">
        Precio con impuestos donde corresponda según tu país de residencia. Suscripción mensual
        renovable automáticamente; puedes cancelarla en cualquier momento desde tu panel de
        cliente, y seguirás teniendo acceso Pro hasta el final del periodo ya pagado. Pago
        procesado de forma segura por Stripe.
      </p>
    </div>
  );
}
