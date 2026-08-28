import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el equipo de PDF Tools.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto", href: "/contact" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Contacto</h1>
      <p className="mt-2 text-ink-soft">
        También puedes escribirnos directamente a{" "}
        <a href="mailto:[EMAIL DE CONTACTO]" className="underline hover:text-ink">
          [EMAIL DE CONTACTO]
        </a>
        .
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
