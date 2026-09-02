import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import AdSlot from "@/components/AdSlot";
import { CATEGORY_LABELS, TOOLS, type ToolDefinition } from "@/lib/tools-config";

export default function ToolPageShell({ tool, children }: { tool: ToolDefinition; children: React.ReactNode }) {
  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
  const faqJsonLd = tool.faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: tool.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) } : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Herramientas", href: "/tools" }, { label: tool.name, href: `/tools/${tool.slug}` }]} />
      <div className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">{CATEGORY_LABELS[tool.category]}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{tool.h1}</h1>
        <p className="mt-3 text-base leading-7 text-ink-soft">{tool.intro}</p>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-line bg-white p-4 shadow-card sm:p-6">{children}</div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-paper px-4 py-3 text-xs font-medium text-ink-soft">
        <span>✓ Procesamiento local</span><span>✓ No necesitas instalar software</span><span>✓ El archivo original no se modifica</span>
      </div>

      {tool.steps.length > 0 && <section className="mt-14"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Proceso</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">Cómo funciona</h2><ol className="mt-6 grid gap-4 sm:grid-cols-2">{tool.steps.map((step, i) => <li key={step} className="rounded-2xl border border-line bg-white p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">{i + 1}</span><p className="mt-4 text-sm leading-6 text-ink-soft">{step}</p></li>)}</ol></section>}

      <AdSlot placement="tool-page" />
      <FAQ items={tool.faqs} />

      {related.length > 0 && <section className="mt-14"><h2 className="font-display text-2xl font-semibold text-ink">También te puede interesar</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{related.map((r) => <Link key={r.slug} href={`/tools/${r.slug}`} className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-ink transition hover:border-accent/50 hover:text-accent">{r.name}<span className="mt-2 block text-xs font-normal text-ink-soft">{r.shortDescription}</span></Link>)}</div></section>}

      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
    </div>
  );
}
