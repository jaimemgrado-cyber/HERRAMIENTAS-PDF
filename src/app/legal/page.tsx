import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal del titular de PDF Tools.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Aviso legal", href: "/legal" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Aviso legal</h1>
      <p className="mt-2 text-sm text-ink-soft">
        [REQUIERE INFORMACIÓN DEL PROPIETARIO antes del lanzamiento]
      </p>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>Datos identificativos</h2>
        <ul>
          <li>Titular: [EMPRESA / NOMBRE DEL TITULAR]</li>
          <li>NIF/CIF: [NIF/CIF]</li>
          <li>Domicilio: [DIRECCIÓN]</li>
          <li>Email de contacto: [EMAIL DE CONTACTO]</li>
          <li>Dominio: [DOMINIO]</li>
          <li>Datos registrales (si aplica): [DATOS REGISTRALES]</li>
        </ul>

        <h2>Objeto</h2>
        <p>
          Este sitio web tiene por objeto ofrecer herramientas online de procesamiento de archivos
          PDF, en los términos descritos en nuestros{" "}
          <a href="/terms">Términos y condiciones</a>.
        </p>

        <h2>Condiciones generales de uso</h2>
        <p>
          El acceso y uso de este sitio atribuye la condición de usuario y supone la aceptación de
          las condiciones incluidas en este aviso legal, en la{" "}
          <a href="/terms">política de términos</a> y en la{" "}
          <a href="/privacy">política de privacidad</a>.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Todos los contenidos del sitio (textos, diseño, código, logotipos) son titularidad de
          [EMPRESA / NOMBRE DEL TITULAR] o de terceros que han autorizado su uso, salvo que se
          indique lo contrario.
        </p>
      </div>
    </div>
  );
}
