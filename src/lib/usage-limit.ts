import { PLAN_LIMITS } from "@/lib/plan-limits";

/**
 * Contador de operaciones diarias del plan gratuito.
 *
 * Como todavía no existe un sistema de cuentas (ver README), el límite se
 * aplica por NAVEGADOR mediante localStorage, no por usuario real. Es una
 * aproximación razonable para un MVP sin backend de autenticación: no es
 * infalible (borrar datos del navegador o usar otro navegador reinicia el
 * contador), pero cubre el caso de uso normal y no depende de servidor.
 *
 * Toda la lógica vive aquí para que las 10 herramientas la reutilicen sin
 * duplicar código. El límite en sí SIEMPRE se lee de PLAN_LIMITS
 * (src/lib/plan-limits.ts): este archivo no contiene el número "3" en
 * ningún sitio.
 */

const STORAGE_KEY = "pdf-tools:daily-usage:v1";

export const FREE_DAILY_LIMIT = PLAN_LIMITS.free.dailyOperations;

export interface UsageSnapshot {
  used: number;
  remaining: number;
  limit: number;
  isLimitReached: boolean;
}

interface UsageRecord {
  /** Fecha local del navegador en formato YYYY-MM-DD. */
  date: string;
  count: number;
}

/**
 * Fecha de "hoy" en formato YYYY-MM-DD según la hora local del navegador.
 * Esto es lo que hace que el contador se reinicie automáticamente cada
 * día: en cuanto cambia la fecha local, cualquier lectura detecta que el
 * registro guardado pertenece a un día distinto y empieza de cero.
 */
function todayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toSnapshot(count: number): UsageSnapshot {
  const used = Math.max(0, count);
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
  return { used, remaining, limit: FREE_DAILY_LIMIT, isLimitReached: remaining <= 0 };
}

function readRecord(): UsageRecord {
  const today = todayKey();

  if (typeof window === "undefined") {
    // Renderizado en servidor: no hay localStorage. Devolvemos "sin
    // consumo" por defecto; el cliente corrige el valor real tras hidratar
    // (ver useUsageLimit → hydrated).
    return { date: today, count: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: today, count: 0 };

    const parsed = JSON.parse(raw) as Partial<UsageRecord>;
    if (parsed.date !== today || typeof parsed.count !== "number") {
      // Registro de un día distinto (o corrupto): se reinicia el contador.
      return { date: today, count: 0 };
    }
    return { date: today, count: Math.max(0, parsed.count) };
  } catch {
    return { date: today, count: 0 };
  }
}

function writeRecord(record: UsageRecord) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage puede no estar disponible (navegación privada, cuota
    // agotada, etc.). Degradamos con seguridad: el contador simplemente no
    // persiste, pero la herramienta sigue funcionando con normalidad.
  }
}

/** Lee el estado actual sin modificarlo. */
export function getUsageSnapshot(): UsageSnapshot {
  const record = readRecord();
  return toSnapshot(record.count);
}

/**
 * Registra UNA operación completada con éxito y devuelve el nuevo estado.
 * Vuelve a leer el valor persistido justo antes de escribir (en vez de
 * fiarse de un contador en memoria), para minimizar el riesgo de perder
 * incrementos si hay varias pestañas abiertas o si ha cambiado el día
 * entre la comprobación previa y este momento.
 *
 * Esta función se llama EXCLUSIVAMENTE cuando el procesamiento ha
 * terminado con éxito (ver cada Tool en src/components/tools/), nunca al
 * seleccionar/subir un archivo.
 */
export function recordSuccessfulOperation(): UsageSnapshot {
  const record = readRecord();
  const next: UsageRecord = { date: todayKey(), count: record.count + 1 };
  writeRecord(next);
  return toSnapshot(next.count);
}
