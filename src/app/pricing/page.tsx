import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PricingCard from "@/components/PricingCard";
import { PLAN_LIMITS, PRO_PRICE_DISPLAY } from "@/lib/plan-limits";

export const metadata: Metadata = {
  title: "PDF Pro: más capacidad, menos límites",
  description: "Compara PDF Tools Free y PDF Pro. Más tamaño de archivo, muchas más operaciones y sin anuncios.",
  alternates: { canonical: "/pricing" },
};

const faq = [
  ["¿Puedo empezar gratis?", `Sí. El plan Free incluye ${PLAN_LIMITS.free.dailyOperations} operaciones al día y archivos de hasta ${PLAN_LIMITS.free.maxFileSizeMB} MB.`],
  ["¿Qué gano con Pro?", `Pro aumenta el límite hasta ${PLAN_LIMITS.pro.dailyOperations.toLocaleString("es-ES")} operaciones al día, permite archivos de hasta ${PLAN_LIMITS.pro.maxFileSizeMB} MB y elimina los anuncios.`],
  ["¿Se renueva automáticamente?", "Sí. Es una suscripción mensual y puedes cancelarla cuando quieras. El acceso continúa hasta el final del periodo pagado."],
  ["¿Cómo se procesa el pago?", "El pago se realiza de forma segura mediante Stripe. PDF Tools no almacena los datos completos de tu tarjeta."],
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Precios", href: "/pricing" }]} />

      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">PDF Pro</span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Trabaja con tus PDF sin quedarte corto.</h1>
        <p className="mt-4 text-base leading-7 text-ink-soft sm:text-lg">Empieza gratis. Cuando necesites más capacidad, Pro elimina los límites que más molestan.</p>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <PricingCard
          name="Free"
          price="0 €"
          features={[
            "Herramientas PDF esenciales",
            `Archivos de hasta ${PLAN_LIMITS.free.maxFileSizeMB} MB`,
            `${PLAN_LIMITS.free.dailyOperations} operaciones al día`,
            "Acceso desde el navegador",
            "Con publicidad",
          ]}
          ctaLabel="Empezar gratis"
          ctaHref="/register"
        />
        <PricingCard
          name="Pro"
          price={PRO_PRICE_DISPLAY.split("/")[0]?.trim() ?? "4,99 €"}
          highlighted
          features={[
            "Todo lo incluido en Free",
            `Archivos de hasta ${PLAN_LIMITS.pro.maxFileSizeMB} MB`,
            `${PLAN_LIMITS.pro.dailyOperations.toLocaleString("es-ES")} operaciones al día`,
            "Sin anuncios",
            "Procesamiento por lotes (cuando esté disponible)",
          ]}
          ctaLabel="Actualizar a Pro"
          checkoutEndpoint="/api/stripe/checkout"
        />
      </section>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-line bg-paper p-5 text-center">
        <p className="text-sm font-semibold text-ink">Sin permanencia</p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">Suscripción mensual. Cancela cuando quieras y conserva Pro hasta el final del periodo pagado.</p>
      </div>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Más capacidad", `${PLAN_LIMITS.pro.maxFileSizeMB} MB por archivo frente a ${PLAN_LIMITS.free.maxFileSizeMB} MB.`],
            ["Muchísimas más operaciones", `${PLAN_LIMITS.pro.dailyOperations.toLocaleString("es-ES")} al día frente a ${PLAN_LIMITS.free.dailyOperations}.`],
            ["Sin anuncios", "Una experiencia más limpia mientras trabajas."],
            ["Pago seguro", "Checkout gestionado por Stripe."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-5">
              <p className="text-sm font-semibold text-ink">✓ {title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-ink">Preguntas frecuentes</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white px-5">
          {faq.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-ink">{question}</summary>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-5 text-ink-soft">Precio con impuestos donde corresponda según tu país de residencia. Pago procesado de forma segura por Stripe.</p>
      <p className="mt-6 text-center text-sm text-ink-soft">¿Tienes dudas antes de suscribirte? <Link href="/contact" className="font-semibold text-accent hover:underline">Contacta con nosotros</Link>.</p>
    </div>
  );
}
