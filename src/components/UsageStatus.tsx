interface UsageStatusProps {
  hydrated: boolean;
  authenticated: boolean;
  used: number;
  remaining: number;
  limit: number;
  isLimitReached: boolean;
}

/**
 * Componente único reutilizado por las 10 herramientas para mostrar el
 * estado de cuenta/límite gratuito diario. Tres estados posibles:
 *   - Sin sesión: invita a iniciar sesión o registrarse (bloquea el uso).
 *   - Límite alcanzado: aviso claro + enlace a /pricing (bloquea el uso).
 *   - Aún quedan operaciones: texto discreto "Te quedan N operaciones...".
 *
 * No renderiza nada hasta que `hydrated` es true, para evitar mostrar un
 * estado que todavía no se ha confirmado con el servidor.
 */
export default function UsageStatus({
  hydrated,
  authenticated,
  used,
  remaining,
  limit,
  isLimitReached,
}: UsageStatusProps) {
  if (!hydrated) return null;

  if (!authenticated) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-xl2 border border-accent/30 bg-accent-soft/40 p-6 text-center"
      >
        <p className="font-medium text-ink">Inicia sesión para usar esta herramienta.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Con una cuenta gratuita tienes 3 operaciones al día. Regístrate en unos segundos.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Crear cuenta gratis
          </a>
        </div>
      </div>
    );
  }

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
