import type { Metadata } from "next";
import Link from "next/link";
import ToolGrid from "@/components/ToolGrid";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Herramientas PDF online gratis",
  description:
    "Une, divide, comprime y convierte tus archivos PDF online, gratis y sin instalar nada. Tus archivos se procesan en tu navegador.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
          Todas tus herramientas PDF, en un solo lugar
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
          Comprime, une, divide, convierte y organiza tus PDF online de forma rápida y sencilla.
          Sin instalar nada.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90"
          >
            Ver todas las herramientas
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-white"
          >
            Ver planes
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-soft">
          Privacidad primero: la mayoría de herramientas procesan tus archivos directamente en tu
          navegador.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <ToolGrid />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot placement="homepage" />
      </section>
    </>
  );
}
