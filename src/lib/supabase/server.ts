import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para código de servidor (Server Components, Route
 * Handlers, Server Actions). Lee/escribe la sesión a través de las cookies
 * de la petición, usando la clave pública (publishable/anon) — el acceso a
 * los datos sigue estando controlado por RLS, no por esta clave.
 *
 * Si se llama desde un Server Component puro, `setAll` puede lanzar
 * (Next.js no permite escribir cookies fuera de Route Handlers/Server
 * Actions); lo ignoramos ahí porque el middleware (`src/middleware.ts`) ya
 * se encarga de refrescar la sesión en cada petición.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Llamado desde un Server Component: se ignora con seguridad.
          }
        },
      },
    }
  );
}
