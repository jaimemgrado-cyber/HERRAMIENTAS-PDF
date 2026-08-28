import { PDFDocument } from "pdf-lib";

/** pageNumbers es 1-indexado: las páginas a CONSERVAR, en el orden dado. */
export async function extractPages(file: File, pageNumbers: number[]): Promise<Blob> {
  if (pageNumbers.length === 0) {
    throw new Error("Selecciona al menos una página.");
  }

  const bytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(bytes);
  const newPdf = await PDFDocument.create();

  const indices = pageNumbers.map((n) => n - 1);
  const pages = await newPdf.copyPages(sourcePdf, indices);
  pages.forEach((page) => newPdf.addPage(page));

  const outBytes = await newPdf.save();
  return new Blob([outBytes], { type: "application/pdf" });
}
