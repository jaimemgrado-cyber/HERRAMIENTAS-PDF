import Link from "next/link";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools";

const NAV_LINKS = [
  { href: "/tools", label: "Herramientas" },
  { href: "/pricing", label: "Precios" },
  { href: "/about", label: "Sobre nosotros" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-semibold text-white"
          >
            PT
          </span>
          <span className="font-display text-lg font-semibold text-ink">{brandName}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
          >
            PDF Pro
          </Link>
        </div>
      </div>
    </header>
  );
}
