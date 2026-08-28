import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "PDF Tools";

const NAV_LINKS = [
  { href: "/tools", label: "Herramientas" },
  { href: "/pricing", label: "Precios" },
  { href: "/about", label: "Sobre nosotros" },
];

export default async function Header() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let plan: "free" | "pro" | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    plan = profile?.plan === "pro" ? "pro" : "free";
  }

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
          {user ? (
            <>
              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline ${
                  plan === "pro" ? "bg-success/10 text-success" : "bg-line text-ink-soft"
                }`}
              >
                {plan === "pro" ? "PRO" : "FREE"}
              </span>
              <span className="hidden max-w-[14ch] truncate text-sm text-ink-soft md:inline">
                {user.email}
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Cerrar sesión
                </button>
              </form>
              {plan !== "pro" && (
                <Link
                  href="/pricing"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
                >
                  PDF Pro
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
