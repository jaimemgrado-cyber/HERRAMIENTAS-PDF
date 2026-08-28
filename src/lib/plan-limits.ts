// Única fuente de verdad para los límites de los planes.
// NO hardcodear tamaños/límites en ningún otro archivo: importar desde aquí.
// Los valores se leen de variables de entorno para poder ajustarlos sin
// tocar código (ver .env.example).

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const PLAN_LIMITS = {
  free: {
    maxFileSizeMB: envInt("FREE_MAX_FILE_SIZE_MB", 15),
    dailyOperations: envInt("FREE_DAILY_OPERATIONS", 20),
    showAds: true,
    batchProcessing: false,
  },
  pro: {
    maxFileSizeMB: envInt("PRO_MAX_FILE_SIZE_MB", 200),
    dailyOperations: envInt("PRO_DAILY_OPERATIONS", 1000),
    showAds: false,
    batchProcessing: true,
  },
} as const;

export type PlanId = keyof typeof PLAN_LIMITS;

export function getLimitsForPlan(plan: PlanId) {
  return PLAN_LIMITS[plan];
}

export const PRO_PRICE_DISPLAY = "4,99 €/mes";
