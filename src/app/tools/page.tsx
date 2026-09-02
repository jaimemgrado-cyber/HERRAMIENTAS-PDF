import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ToolGrid from "@/components/ToolGrid";

export const metadata: Metadata = {
  title: "Todas las herramientas PDF",
  description: "Explora herramientas PDF para unir, dividir, comprimir, convertir y organizar documentos online.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Herramientas", href: "/tools" }]} />
      <div className="mt-6 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Biblioteca PDF</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">Todas las herramientas PDF</h1><p className="mt-4 text-base leading-7 text-ink-soft">Herramientas para trabajar con documentos sin instalaciones. Elige una tarea y empieza directamente.</p></div>
      <div className="mt-10"><ToolGrid /></div>
    </div>
  );
}
