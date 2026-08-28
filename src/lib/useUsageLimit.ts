"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsageSnapshot, recordSuccessfulOperation, type UsageSnapshot } from "@/lib/usage-limit";

const INITIAL: UsageSnapshot = { used: 0, remaining: Infinity, limit: Infinity, isLimitReached: false };

/**
 * Hook reutilizable para las 10 herramientas PDF. Centraliza:
 *   - leer cuántas operaciones gratuitas quedan hoy;
 *   - comprobar el límite justo antes de procesar (`checkCanProceed`);
 *   - registrar el consumo justo después de un procesamiento con éxito
 *     (`consume`).
 *
 * `hydrated` evita mostrar un número potencialmente incorrecto durante el
 * primer render en servidor (donde no existe localStorage): la UI que
 * consuma este hook debe esperar a `hydrated === true` antes de mostrar el
 * contador o el aviso de límite alcanzado.
 */
export function useUsageLimit() {
  const [snapshot, setSnapshot] = useState<UsageSnapshot>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSnapshot(getUsageSnapshot());
    setHydrated(true);
  }, []);

  /**
   * Vuelve a leer el estado real (por si ha cambiado en otra pestaña o ha
   * pasado la medianoche) y devuelve si se puede iniciar una nueva
   * operación. Debe llamarse SIEMPRE justo antes de lanzar el
   * procesamiento de una herramienta.
   */
  const checkCanProceed = useCallback((): boolean => {
    const current = getUsageSnapshot();
    setSnapshot(current);
    return !current.isLimitReached;
  }, []);

  /**
   * Registra una operación completada con éxito. Debe llamarse SOLO tras
   * un procesamiento correcto, nunca al seleccionar/subir un archivo ni si
   * el procesamiento ha fallado.
   */
  const consume = useCallback((): UsageSnapshot => {
    const updated = recordSuccessfulOperation();
    setSnapshot(updated);
    return updated;
  }, []);

  return { ...snapshot, hydrated, checkCanProceed, consume };
}
