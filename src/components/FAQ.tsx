export interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ({ items, title = "Preguntas frecuentes" }: { items: FAQItem[]; title?: string }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="font-display text-xl font-semibold text-ink">
        {title}
      </h2>
      <dl className="mt-4 divide-y divide-line rounded-xl2 border border-line bg-white">
        {items.map((item) => (
          <div key={item.question} className="p-5">
            <dt className="font-medium text-ink">{item.question}</dt>
            <dd className="mt-2 text-sm text-ink-soft">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
