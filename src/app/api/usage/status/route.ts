import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type PlanId } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

/**
 * Devuelve el estado ACTUAL de uso del usuario autenticado, sin consumir
 * ninguna operación. Se usa para mostrar "Te quedan N operaciones hoy" al
 * cargar una herramienta, antes de que el usuario haga nada.
 *
 * Si no hay sesión, devuelve authenticated: false — la UI debe entonces
 * invitar a iniciar sesión en vez de mostrar un contador.
 */
export async function GET() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: PlanId = profile?.plan === "pro" ? "pro" : "free";
  const limit = PLAN_LIMITS[plan].dailyOperations;

  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from("usage_daily")
    .select("operations")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .maybeSingle();

  const used = usage?.operations ?? 0;
  const remaining = Math.max(0, limit - used);

  return NextResponse.json({
    authenticated: true,
    email: user.email,
    plan,
    used,
    remaining,
    limit,
    isLimitReached: remaining <= 0,
  });
}
