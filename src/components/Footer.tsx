import Link from "next/link";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Herramientas",
    links: [
      { href: "/tools", label: "Todas las herramientas" },
      { href: "/tools/compress-pdf", label: "Comprimir PDF" },
      { href: "/tools/merge-pdf", label: "Unir PDF" },
      { href: "/tools/split-pdf", label: "Dividir PDF" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/about", label: "Sobre nosotros" },
      { href: "/contact", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal", label: "Aviso legal" },
      { href: "/privacy", label: "Privacidad" },
      { href: "/cookies", label: "Cookies" },
      { href: "/terms", label: "Términos" },
    ],
  },
  {
    title: "Producto",
    links: [
      { href: "/pricing", label: "Precios" },
      { href: "/pricing", label: "Pro" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-ink-soft sm:px-6">
        © {new Date().getFullYear()} {brandName}. [EMPRESA / NOMBRE DEL TITULAR] · [NIF/CIF] ·{" "}
        <Link href="/legal" className="underline hover:text-ink">
          Aviso legal
        </Link>
      </div>
    </footer>
  );
}
