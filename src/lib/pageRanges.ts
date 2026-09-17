/**
 * Convierte una cadena tipo "1,3,5-7" en un array de números de página
 * (1-indexado), sin duplicados y ordenado.
 */
export function parsePageRanges(input: string, totalPages?: number): number[] {
  const pages = new Set<number>();
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((p) => p.trim());
      const start = parseInt(startStr ?? "", 10);
      const end = parseInt(endStr ?? "", 10);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        const lo = Math.min(start, end);
        const hi = totalPages ? Math.min(Math.max(start, end), totalPages) : Math.max(start, end);
        for (let p = lo; p <= hi; p++) pages.add(p);
      }
    } else {
      const num = parseInt(part, 10);
      if (Number.isFinite(num) && (!totalPages || num <= totalPages)) {
        pages.add(num);
      }
    }
  }

  return [...pages].sort((a, b) => a - b);
}
