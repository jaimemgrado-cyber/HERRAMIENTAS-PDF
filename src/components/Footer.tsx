import Link from "next/link";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools";
const CONTACT_EMAIL = "support.digitaltools@gmail.com";

const COLUMNS = [
  { title: "Herramientas", links: [{ href: "/tools", label: "Todas las herramientas" }, { href: "/tools/compress-pdf", label: "Comprimir PDF" }, { href: "/tools/merge-pdf", label: "Unir PDF" }, { href: "/tools/split-pdf", label: "Dividir PDF" }] },
  { title: "Producto", links: [{ href: "/pricing", label: "Precios" }, { href: "/pricing", label: "PDF Pro" }, { href: "/about", label: "Sobre nosotros" }, { href: "/contact", label: "Contacto" }] },
  { title: "Legal", links: [{ href: "/legal", label: "Aviso legal" }, { href: "/privacy", label: "Privacidad" }, { href: "/cookies", label: "Cookies" }, { href: "/terms", label: "Términos" }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-ink">{brandName}</Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">Herramientas PDF sencillas para trabajar con tus documentos desde el navegador.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent">{CONTACT_EMAIL}</a>
          </div>
          {COLUMNS.map((col) => <div key={col.title}><h2 className="text-sm font-semibold text-ink">{col.title}</h2><ul className="mt-4 space-y-2.5">{col.links.map((link) => <li key={link.href + link.label}><Link href={link.href} className="text-sm text-ink-soft hover:text-accent">{link.label}</Link></li>)}</ul></div>)}
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 sm:px-6"><div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {brandName}.</span><span>Herramientas PDF online · Privacidad primero</span></div></div>
    </footer>
  );
}
