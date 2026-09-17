import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal de PDF Tools.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aviso legal", href: "/legal" },
        ]}
      />

      <h1 className="font-display text-3xl font-semibold text-ink">
        Aviso legal
      </h1>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>Objeto</h2>
        <p>
          Este sitio web ofrece herramientas online para el procesamiento de
          archivos PDF, incluyendo funciones para unir, dividir, comprimir y
          convertir documentos.
        </p>

        <h2>Condiciones generales de uso</h2>
        <p>
          El acceso y uso de este sitio implica la aceptación de las
          condiciones establecidas en este aviso legal, así como en los{" "}
          <a href="/terms">Términos y condiciones</a> y la{" "}
          <a href="/privacy">Política de privacidad</a>.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los contenidos, diseño, código y demás elementos de este sitio web
          están protegidos por la normativa aplicable en materia de propiedad
          intelectual, salvo que se indique expresamente lo contrario.
        </p>

        <h2>Contacto</h2>
        <p>
          Para consultas relacionadas con el funcionamiento del servicio,
          puedes utilizar la página de <a href="/contact">Contacto</a>.
        </p>
      </div>
    </div>
  );
}
