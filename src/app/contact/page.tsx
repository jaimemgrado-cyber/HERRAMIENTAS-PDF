import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";

const CONTACT_EMAIL = "support.digitaltools@gmail.com";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con PDF Tools para preguntas, sugerencias o ayuda con las herramientas PDF.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto", href: "/contact" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Estamos aquí para ayudarte</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Contacto</h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft">¿Tienes una pregunta, has encontrado un problema o quieres sugerir una herramienta? Escríbenos y te responderemos lo antes posible.</p>
          <div className="mt-7 rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Email de soporte</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block break-all text-base font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent">{CONTACT_EMAIL}</a>
            <p className="mt-2 text-xs leading-5 text-ink-soft">También puedes utilizar el formulario para enviarnos una consulta.</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-semibold text-ink">Envíanos un mensaje</h2>
          <p className="mt-1 text-sm text-ink-soft">Cuéntanos brevemente en qué podemos ayudarte.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </div>
    </div>
  );
}
