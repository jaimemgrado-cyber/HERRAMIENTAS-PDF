import { PDFDocument } from "pdf-lib";

/** pageNumbers es 1-indexado: las páginas a ELIMINAR. */
export async function deletePages(file: File, pageNumbers: number[]): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const toRemove = new Set(pageNumbers);

  if (toRemove.size >= pdf.getPageCount()) {
    throw new Error("No puedes eliminar todas las páginas del documento.");
  }

  // Eliminar de mayor a menor índice para no desplazar índices pendientes.
  const sortedDesc = [...toRemove].sort((a, b) => b - a);
  for (const pageNum of sortedDesc) {
    const index = pageNum - 1;
    if (index >= 0 && index < pdf.getPageCount()) {
      pdf.removePage(index);
    }
  }

  const outBytes = await pdf.save();
  return new Blob([outBytes], { type: "application/pdf" });
}
