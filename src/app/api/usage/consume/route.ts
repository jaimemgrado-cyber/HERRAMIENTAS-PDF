import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/plan-limits";

/**
 * Comprueba el límite diario del usuario autenticado Y consume una
 * operación en la MISMA llamada, de forma atómica (ver función SQL
 * `consume_operation` en supabase/migrations/0001_init.sql).
 *
 * Este endpoint es el único punto por el que las 10 herramientas PDF
 * consumen una operación. Se llama justo antes de empezar el
 * procesamiento en el navegador (ver src/lib/useUsageLimit.ts): como el
 * procesamiento en sí es 100% client-side por privacidad, el servidor no
 * puede saber si terminó bien o mal, así que "intentar procesar" es lo que
 * consume la operación — igual que la mayoría de productos freemium
 * cuentan un intento, no un resultado. Esto está documentado también en el
 * README.
 *
 * Nunca confía en nada que venga del cliente para determinar el plan o el
 * límite: el plan se lee de `profiles.plan` dentro de la función SQL
 * (rellenado exclusivamente por el webhook de Stripe), y los NÚMEROS de
 * límite vienen de PLAN_LIMITS (fuente única de verdad), no del request.
 */
export async function POST() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "not_authenticated", message: "Debes iniciar sesión para usar esta herramienta." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .rpc("consume_operation", {
      p_free_limit: PLAN_LIMITS.free.dailyOperations,
      p_pro_limit: PLAN_LIMITS.pro.dailyOperations,
    })
    .single();

  if (error || !data) {
    // eslint-disable-next-line no-console
    console.error("[usage:consume] Error en consume_operation", error);
    return NextResponse.json(
      { error: "server_error", message: "No se ha podido comprobar tu límite de uso." },
      { status: 500 }
    );
  }

  const result = data as {
    allowed: boolean;
    plan: string;
    used: number;
    remaining: number;
    daily_limit: number;
  };

  return NextResponse.json({
    authenticated: true,
    allowed: result.allowed,
    plan: result.plan,
    used: result.used,
    remaining: result.remaining,
    limit: result.daily_limit,
    isLimitReached: result.remaining <= 0,
  });
}
