import { PDFDocument } from "pdf-lib";

/** newOrder es un array 1-indexado con el nuevo orden completo de páginas. */
export async function sortPages(file: File, newOrder: number[]): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(bytes);

  if (newOrder.length !== sourcePdf.getPageCount()) {
    throw new Error("El nuevo orden debe incluir todas las páginas del documento.");
  }

  const newPdf = await PDFDocument.create();
  const indices = newOrder.map((n) => n - 1);
  const pages = await newPdf.copyPages(sourcePdf, indices);
  pages.forEach((page) => newPdf.addPage(page));

  const outBytes = await newPdf.save();
  return new Blob([outBytes], { type: "application/pdf" });
}
