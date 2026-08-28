/**
 * Wrappers ligeros sobre /api/usage/status y /api/usage/consume.
 *
 * TODA la lógica real de límites vive en el SERVIDOR (esas dos rutas +
 * la función SQL consume_operation, ver supabase/migrations/0001_init.sql).
 * Este archivo no decide nada por sí mismo: solo llama a la API y
 * normaliza la respuesta para el hook de React (useUsageLimit.ts).
 *
 * IMPORTANTE: esto sustituye el antiguo sistema basado en localStorage.
 * Ya no hay ningún contador ni comprobación de límite en el navegador.
 */

export interface UsageSnapshot {
  /** false si no hay sesión de Supabase activa. */
  authenticated: boolean;
  plan?: "free" | "pro";
  used: number;
  remaining: number;
  limit: number;
  isLimitReached: boolean;
}

const NOT_AUTHENTICATED: UsageSnapshot = {
  authenticated: false,
  used: 0,
  remaining: 0,
  limit: 0,
  isLimitReached: false,
};

export const LOGIN_REQUIRED_MESSAGE =
  "Debes iniciar sesión para usar esta herramienta. Crea una cuenta gratis o inicia sesión.";

export function limitReachedMessage(limit: number): string {
  return `Has alcanzado tus ${limit} operaciones gratuitas de hoy. Puedes volver mañana o actualizar a PDF Pro.`;
}


/** Lee el estado actual sin consumir ninguna operación. */
export async function fetchUsageStatus(): Promise<UsageSnapshot> {
  try {
    const res = await fetch("/api/usage/status", { cache: "no-store" });
    if (!res.ok) return NOT_AUTHENTICATED;
    const data = await res.json();
    if (!data.authenticated) return NOT_AUTHENTICATED;
    return {
      authenticated: true,
      plan: data.plan,
      used: data.used,
      remaining: data.remaining,
      limit: data.limit,
      isLimitReached: data.isLimitReached,
    };
  } catch {
    return NOT_AUTHENTICATED;
  }
}

export interface ConsumeResult extends UsageSnapshot {
  /** true si la operación se ha permitido y contabilizado en el servidor. */
  allowed: boolean;
}

/**
 * Comprueba el límite y consume una operación de forma atómica en el
 * servidor. Debe llamarse justo antes de iniciar el procesamiento de una
 * herramienta (ver cada componente en src/components/tools/).
 */
export async function consumeOperation(): Promise<ConsumeResult> {
  try {
    const res = await fetch("/api/usage/consume", { method: "POST" });
    const data = await res.json();

    if (res.status === 401 || !data.authenticated) {
      return { ...NOT_AUTHENTICATED, allowed: false };
    }
    if (!res.ok) {
      // Error de servidor: no dejamos avanzar la operación, pero no la
      // presentamos como "límite alcanzado" para no confundir al usuario.
      return {
        authenticated: true,
        allowed: false,
        used: 0,
        remaining: 0,
        limit: 0,
        isLimitReached: false,
      };
    }

    return {
      authenticated: true,
      allowed: data.allowed,
      plan: data.plan,
      used: data.used,
      remaining: data.remaining,
      limit: data.limit,
      isLimitReached: data.isLimitReached,
    };
  } catch {
    return {
      authenticated: true,
      allowed: false,
      used: 0,
      remaining: 0,
      limit: 0,
      isLimitReached: false,
    };
  }
}
