"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchUsageStatus,
  consumeOperation as consumeOperationApi,
  type UsageSnapshot,
  type ConsumeResult,
} from "@/lib/usage-limit";

const INITIAL: UsageSnapshot = {
  authenticated: false,
  used: 0,
  remaining: 0,
  limit: 0,
  isLimitReached: false,
};

/**
 * Hook reutilizable por las 10 herramientas PDF. Sustituye por completo el
 * antiguo contador de localStorage: aquí no se decide ni se guarda nada,
 * solo se refleja el estado que devuelve el servidor.
 *
 * - Al montar, consulta GET /api/usage/status para poder mostrar "Te
 *   quedan N operaciones" (o el aviso de iniciar sesión) sin que el
 *   usuario tenga que hacer nada todavía.
 * - `consume()` llama a POST /api/usage/consume, que comprueba el límite
 *   Y lo incrementa de forma atómica en el servidor. Debe llamarse justo
 *   antes de lanzar el procesamiento real de cada herramienta, y su
 *   resultado (`allowed`) es lo único que decide si se puede continuar.
 */
export function useUsageLimit() {
  const [snapshot, setSnapshot] = useState<UsageSnapshot>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const status = await fetchUsageStatus();
    setSnapshot(status);
    return status;
  }, []);

  useEffect(() => {
    let cancelled = false;
    refresh().finally(() => {
      if (!cancelled) setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const consume = useCallback(async (): Promise<ConsumeResult> => {
    const result = await consumeOperationApi();
    setSnapshot(result);
    setHydrated(true);
    return result;
  }, []);

  return { ...snapshot, hydrated, refresh, consume };
}
