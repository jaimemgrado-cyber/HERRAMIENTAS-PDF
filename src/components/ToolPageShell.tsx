import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import AdSlot from "@/components/AdSlot";
import { CATEGORY_LABELS, TOOLS, type ToolDefinition } from "@/lib/tools-config";

export default function ToolPageShell({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
}) {
  const related = TOOLS.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug
  ).slice(0, 3);

  const faqJsonLd =
    tool.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Herramientas", href: "/tools" },
          { label: tool.name, href: `/tools/${tool.slug}` },
        ]}
      />

      <p className="text-sm font-medium text-accent">{CATEGORY_LABELS[tool.category]}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">{tool.h1}</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{tool.intro}</p>

      <div className="mt-8">{children}</div>

      {tool.steps.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">Cómo funciona</h2>
          <ol className="mt-4 space-y-3">
            {tool.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-ink-soft">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <AdSlot placement="tool-page" />

      <FAQ items={tool.faqs} />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">Herramientas relacionadas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/tools/${r.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </div>
  );
}
