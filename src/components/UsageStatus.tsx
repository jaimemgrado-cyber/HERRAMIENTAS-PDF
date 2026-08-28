interface UsageStatusProps {
  hydrated: boolean;
  used: number;
  remaining: number;
  limit: number;
  isLimitReached: boolean;
}

/**
 * Componente único reutilizado por las 10 herramientas para mostrar el
 * estado del límite gratuito diario. Dos estados posibles:
 *   - Límite alcanzado: aviso claro + enlace a /pricing (bloquea el uso).
 *   - Aún quedan operaciones: texto discreto "Te quedan N operaciones...".
 *
 * No renderiza nada hasta que `hydrated` es true, para evitar mostrar un
 * número que todavía no se ha leído de localStorage.
 */
export default function UsageStatus({
  hydrated,
  used,
  remaining,
  limit,
  isLimitReached,
}: UsageStatusProps) {
  if (!hydrated) return null;

  if (isLimitReached) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-xl2 border border-accent/30 bg-accent-soft/40 p-6 text-center"
      >
        <p className="font-medium text-ink">Has alcanzado tus {limit} operaciones gratuitas de hoy.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Puedes volver mañana o actualizar a PDF Pro para seguir utilizando las herramientas.
        </p>
        <a
          href="/pricing"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Pasar a PDF Pro — 4,99 €/mes
        </a>
      </div>
    );
  }

  // Solo mostramos el aviso de "te quedan pocas" cuando aporta información
  // útil (una vez se ha usado al menos una operación), para no repetir
  // "Te quedan 3 de 3" antes de que el usuario haya hecho nada.
  if (used === 0) return null;

  return (
    <p className="mt-3 text-xs text-ink-soft">
      Te quedan {remaining} {remaining === 1 ? "operación gratuita" : "operaciones gratuitas"} hoy.
    </p>
  );
}
