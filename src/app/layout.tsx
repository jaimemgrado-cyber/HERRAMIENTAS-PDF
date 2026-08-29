import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://pdf-tools-nine-swart.vercel.app";

const brandName =
  process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),

  title: {
    default: `${brandName} — Herramientas PDF online gratis`,
    template: `%s | ${brandName}`,
  },

  description:
    "Une, divide, comprime y convierte tus archivos PDF online, gratis y sin instalar nada.",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "5uhdB1e1ufSh3UdBy8zC56w5zHmp941j2htDhl9l2GM",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: brandName,
    title: `${brandName} — Herramientas PDF online gratis`,
    description:
      "Une, divide, comprime y convierte tus archivos PDF online, gratis y sin instalar nada.",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: `${brandName} — Herramientas PDF online gratis`,
    description:
      "Une, divide, comprime y convierte tus archivos PDF online, gratis y sin instalar nada.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans bg-paper text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>

        <Header />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />

        <CookieBanner />
      </body>
    </html>
  );
}
