import type { Metadata } from "next";
import Link from "next/link";
import ToolGrid from "@/components/ToolGrid";
import AdSlot from "@/components/AdSlot";
import { TOOLS } from "@/lib/tools-config";

export const metadata: Metadata = {
  title: "Herramientas PDF online gratis",
  description:
    "Une, divide, comprime y convierte PDF online. Herramientas rápidas y sencillas, con procesamiento local para una mayor privacidad.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

const popular = TOOLS.filter((tool) =>
  ["merge-pdf", "compress-pdf", "split-pdf", "jpg-to-pdf", "pdf-to-jpg", "delete-pages"].includes(tool.slug)
);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                PDF tools rápidas y sencillas
              </span>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
                Haz más con tus PDF. Sin complicarte.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft sm:text-xl">
                Une, divide, comprime, convierte y organiza documentos directamente desde tu navegador.
                Sin instalaciones y con privacidad como prioridad.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tools" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/90">
                  Explorar herramientas <span className="ml-2" aria-hidden>→</span>
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink">
                  Ver PDF Pro
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-soft">
                <span>✓ Procesamiento local</span>
                <span>✓ Sin instalar software</span>
                <span>✓ Plan gratuito</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-[2rem] border border-line bg-paper p-4 shadow-card sm:p-6">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">PDF Tools</p>
                      <p className="mt-1 font-display text-xl font-semibold text-ink">Tu documento, listo.</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent" aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="M6 3.75h8l4 4v12.5H6z"/><path d="M14 3.75v4h4M8.5 14h7M8.5 17h5"/></svg>
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Unir PDF", "Combina documentos"],
                      ["Comprimir PDF", "Reduce el tamaño"],
                      ["Convertir", "JPG, PNG y PDF"],
                    ].map(([title, desc]) => (
                      <div key={title} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-success shadow-sm" aria-hidden>✓</span>
                        <div><p className="text-sm font-semibold text-ink">{title}</p><p className="text-xs text-ink-soft">{desc}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl bg-ink px-4 py-3 text-center text-xs font-semibold text-white">Procesa tus archivos desde el navegador</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 px-4 sm:px-6 md:grid-cols-3">
          {[
            ["Privacidad", "Tus archivos se procesan localmente en las herramientas compatibles."],
            ["Sencillez", "Interfaz clara para completar una tarea y descargar el resultado."],
            ["Más capacidad", "PDF Pro aumenta los límites y elimina la publicidad."],
          ].map(([title, text]) => (
            <div key={title} className="border-b border-line py-6 last:border-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Más utilizadas</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">Empieza por una herramienta</h2></div>
          <Link href="/tools" className="hidden text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent sm:inline">Ver todas →</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-accent/40">
              <div className="flex items-start justify-between gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent" aria-hidden>PDF</span><span className="text-lg text-ink-soft transition group-hover:translate-x-1">→</span></div>
              <h3 className="mt-5 text-base font-semibold text-ink group-hover:text-accent">{tool.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink-soft">{tool.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[2rem] bg-ink p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">PDF Pro</p><h2 className="mt-2 font-display text-3xl font-semibold">Más archivos. Menos límites.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Trabaja con archivos de hasta 200 MB, hasta 1.000 operaciones al día y sin anuncios.</p></div>
          <Link href="/pricing" className="mt-6 inline-flex shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-paper lg:mt-0">Conocer Pro →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <h2 className="font-display text-2xl font-semibold text-ink">Todas las herramientas</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">Elige una categoría y encuentra la herramienta adecuada para tu documento.</p>
        <div className="mt-8"><ToolGrid /></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6"><AdSlot placement="homepage" /></section>
    </>
  );
}
