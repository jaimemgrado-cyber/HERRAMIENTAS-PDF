import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ToolGrid from "@/components/ToolGrid";

export const metadata: Metadata = {
  title: "Todas las herramientas PDF",
  description: "Explora todas las herramientas PDF disponibles: unir, dividir, comprimir, convertir y más.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Herramientas", href: "/tools" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Herramientas PDF</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Elige la herramienta que necesitas. Las marcadas como &quot;Próximamente&quot; están en desarrollo.
      </p>
      <div className="mt-10">
        <ToolGrid />
      </div>
    </div>
  );
}
