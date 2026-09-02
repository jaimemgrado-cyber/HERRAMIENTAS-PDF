interface UsageStatusProps {
  hydrated: boolean;
  authenticated: boolean;
  plan?: "free" | "pro";
  used: number;
  remaining: number;
  limit: number;
  isLimitReached: boolean;
}

export default function UsageStatus({
  hydrated,
  authenticated,
  plan,
  used,
  remaining,
  limit,
  isLimitReached,
}: UsageStatusProps) {
  if (!hydrated) return null;

  if (!authenticated) {
    return (
      <div role="alert" className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft/40 p-6 text-center">
        <p className="font-medium text-ink">Inicia sesión para usar esta herramienta.</p>
        <p className="mt-1 text-sm text-ink-soft">Crea una cuenta gratis para empezar con {limit || 3} operaciones al día.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a href="/login" className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent">Iniciar sesión</a>
          <a href="/register" className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent">Crear cuenta gratis</a>
        </div>
      </div>
    );
  }

  if (plan === "pro") {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent-soft/20 px-4 py-3">
        <p className="text-xs font-semibold text-ink"><span className="mr-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">Pro</span>Sin límites Free y sin anuncios.</p>
        <span className="text-xs text-ink-soft">{remaining.toLocaleString("es-ES")} operaciones disponibles hoy</span>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div role="alert" className="mt-6 overflow-hidden rounded-2xl border border-accent/30 bg-white shadow-sm">
        <div className="border-b border-line bg-accent-soft/40 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Has llegado al límite</p>
          <p className="mt-1 text-lg font-semibold text-ink">Ya has usado tus {limit} operaciones gratuitas de hoy.</p>
        </div>
        <div className="p-6">
          <p className="text-sm leading-6 text-ink-soft">No tienes que esperar hasta mañana. Con PDF Pro puedes seguir trabajando con archivos de hasta 200 MB y hasta 1.000 operaciones al día, además de trabajar sin anuncios.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a href="/pricing" className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">Actualizar a Pro — 4,99 €/mes</a>
            <a href="/pricing" className="text-sm font-semibold text-accent hover:underline">Ver qué incluye Pro →</a>
          </div>
          <p className="mt-3 text-xs text-ink-soft">Suscripción mensual. Cancela cuando quieras.</p>
        </div>
      </div>
    );
  }

  if (used === 0) return null;

  if (remaining === 1) {
    return (
      <div className="mt-4 rounded-2xl border border-accent/25 bg-accent-soft/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink">Te queda 1 operación gratuita hoy.</p>
            <p className="mt-1 text-xs leading-5 text-ink-soft">Si vas a trabajar con más archivos, Pro te evita tener que esperar al día siguiente.</p>
          </div>
          <a href="/pricing" className="shrink-0 inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-accent">Ver PDF Pro</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3">
      <p className="text-xs text-ink-soft">Te quedan <strong className="text-ink">{remaining}</strong> operaciones gratuitas hoy.</p>
      <a href="/pricing" className="text-xs font-semibold text-accent hover:underline">Conocer Pro →</a>
    </div>
  );
}
