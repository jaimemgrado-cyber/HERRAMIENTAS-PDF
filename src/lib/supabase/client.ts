import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Client Components. Usa la clave pública
 * (publishable/anon) — segura para exponer al navegador, ya que el acceso
 * real a los datos está controlado por Row Level Security (RLS) en
 * Supabase, no por esta clave.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
