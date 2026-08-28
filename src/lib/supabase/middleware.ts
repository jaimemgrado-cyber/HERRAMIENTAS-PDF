import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase (si existe) en cada petición y propaga
 * las cookies actualizadas tanto a la petición como a la respuesta. Esto
 * evita que la sesión expire silenciosamente entre Server Components y
 * Route Handlers. Patrón estándar recomendado por Supabase para Next.js
 * App Router.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANTE: esta llamada es la que realmente refresca el token si ha
  // caducado. No eliminar ni mover después de leer `response`.
  await supabase.auth.getUser();

  return response;
}
