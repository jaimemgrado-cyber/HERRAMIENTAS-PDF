import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Conoce el proyecto PDF Tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Sobre nosotros", href: "/about" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Sobre nosotros</h1>
      <div className="prose prose-slate mt-6 max-w-none text-ink-soft">
        <p>
          PDF Tools nace con un objetivo sencillo: ofrecer herramientas PDF rápidas, claras y
          respetuosas con tu privacidad, sin fricciones innecesarias.
        </p>
        <p>
          Este proyecto está operado por [EMPRESA / NOMBRE DEL TITULAR]. Puedes encontrar los
          datos legales completos en nuestro{" "}
          <a href="/legal" className="underline hover:text-ink">
            aviso legal
          </a>
          .
        </p>
        <p>
          Si tienes cualquier duda o sugerencia, puedes escribirnos desde nuestra{" "}
          <a href="/contact" className="underline hover:text-ink">
            página de contacto
          </a>
          .
        </p>
      </div>
    </div>
  );
}
