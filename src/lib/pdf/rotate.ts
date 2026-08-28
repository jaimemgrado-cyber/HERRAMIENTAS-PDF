import { PDFDocument, degrees } from "pdf-lib";

export type RotationAngle = 90 | 180 | 270;

/**
 * Rota páginas de un PDF. Si pageNumbers es undefined, rota todas las
 * páginas. pageNumbers es 1-indexado.
 */
export async function rotatePdf(
  file: File,
  angle: RotationAngle,
  pageNumbers?: number[]
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const pages = pdf.getPages();

  const targets = pageNumbers ? new Set(pageNumbers.map((n) => n - 1)) : null;

  pages.forEach((page, index) => {
    if (!targets || targets.has(index)) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    }
  });

  const outBytes = await pdf.save();
  return new Blob([outBytes], { type: "application/pdf" });
}
