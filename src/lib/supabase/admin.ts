import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la SERVICE ROLE KEY.
 *
 * ⚠️ SOLO debe usarse en código de servidor que nunca se envía al
 * navegador (actualmente: únicamente el webhook de Stripe,
 * src/app/api/stripe/webhook/route.ts). Esta clave omite RLS por
 * completo, así que cualquier uso fuera de un contexto de servidor
 * totalmente controlado es un riesgo de seguridad grave.
 *
 * No tiene el prefijo NEXT_PUBLIC_, así que Next.js nunca la incluye en el
 * bundle del cliente — pero además, ningún archivo de este proyecto debe
 * importar este módulo salvo el webhook.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client: faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
