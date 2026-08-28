import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${appUrl}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden>/</span>}
            {index === items.length - 1 ? (
              <span className="text-ink">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-ink hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
