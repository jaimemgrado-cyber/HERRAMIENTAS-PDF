import { PDFDocument } from "pdf-lib";

export interface SplitRange {
  /** Página inicial, 1-indexada, inclusive. */
  from: number;
  /** Página final, 1-indexada, inclusive. */
  to: number;
}

/**
 * Divide un PDF en varios documentos según los rangos indicados.
 * Devuelve un Blob PDF por cada rango.
 */
export async function splitPdf(file: File, ranges: SplitRange[]): Promise<{ name: string; blob: Blob }[]> {
  const bytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(bytes);
  const totalPages = sourcePdf.getPageCount();

  const results: { name: string; blob: Blob }[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (!range) continue;
    const from = Math.max(1, range.from);
    const to = Math.min(totalPages, range.to);
    if (from > to) continue;

    const newPdf = await PDFDocument.create();
    const indices = [];
    for (let p = from; p <= to; p++) indices.push(p - 1);

    const pages = await newPdf.copyPages(sourcePdf, indices);
    pages.forEach((page) => newPdf.addPage(page));

    const outBytes = await newPdf.save();
    results.push({
      name: `parte-${i + 1}-paginas-${from}-${to}.pdf`,
      blob: new Blob([outBytes], { type: "application/pdf" }),
    });
  }

  return results;
}

/** Genera automáticamente un rango por cada N páginas. */
export function evenRanges(totalPages: number, pagesPerFile: number): SplitRange[] {
  const ranges: SplitRange[] = [];
  for (let start = 1; start <= totalPages; start += pagesPerFile) {
    ranges.push({ from: start, to: Math.min(start + pagesPerFile - 1, totalPages) });
  }
  return ranges;
}
