import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

const CONTACT_EMAIL = "support.digitaltools@gmail.com";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con PDF Tools para preguntas, sugerencias o ayuda con las herramientas PDF.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto", href: "/contact" }]} />

      <div className="mt-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Estamos aquí para ayudarte</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Contacto</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-soft">
          ¿Tienes una pregunta, has encontrado un problema o quieres sugerir una herramienta?
          Escríbenos directamente por email.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl rounded-[1.5rem] border border-line bg-white p-8 text-center shadow-card sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Email de soporte</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-4 block break-all text-xl font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent sm:text-2xl"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          Puedes copiar esta dirección o hacer clic en ella para abrir tu aplicación de correo y escribirnos.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20sobre%20PDF%20Tools`}
          className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
        >
          Abrir correo
        </a>
      </div>
    </div>
  );
}
