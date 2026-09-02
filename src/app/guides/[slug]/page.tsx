import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GUIDES, getGuideBySlug } from "@/lib/guides";
import { getToolBySlug } from "@/lib/tools-config";

export function generateStaticParams() { return GUIDES.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { title: guide.title, description: guide.description, type: "article" } };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();
  const tool = getToolBySlug(guide.toolSlug)!;
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
    <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Guías PDF", href: "/guides" }, { label: guide.title, href: `/guides/${guide.slug}` }]} />
    <article className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Guía PDF</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{guide.h1}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-soft">{guide.intro}</p>
      <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-ink">Hazlo ahora</h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">Puedes aplicar estos pasos directamente con nuestra herramienta gratuita.</p>
        <Link href={`/tools/${tool.slug}`} className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90">{tool.name} →</Link>
      </div>
      <div className="mt-12 space-y-10">{guide.sections.map((section) => <section key={section.heading}><h2 className="font-display text-2xl font-semibold text-ink">{section.heading}</h2>{section.paragraphs.map((p) => <p key={p} className="mt-3 text-base leading-7 text-ink-soft">{p}</p>)}</section>)}</div>
      <section className="mt-12"><h2 className="font-display text-2xl font-semibold text-ink">Preguntas frecuentes</h2><div className="mt-5 space-y-3">{guide.faqs.map((faq) => <details key={faq.question} className="rounded-2xl border border-line bg-white p-5"><summary className="cursor-pointer font-semibold text-ink">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-ink-soft">{faq.answer}</p></details>)}</div></section>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
  </div>;
}
