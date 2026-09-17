import { PDFDocument } from "pdf-lib";

export type ImageType = "jpg" | "png";

/**
 * Convierte una o varias imágenes en un único PDF (una imagen por página),
 * ajustando cada imagen al tamaño de página A4 manteniendo la proporción.
 */
export async function imagesToPdf(files: File[], type: ImageType): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image = type === "jpg" ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);

    const page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
    const scale = Math.min(A4_WIDTH / image.width, A4_HEIGHT / image.height);
    const width = image.width * scale;
    const height = image.height * scale;

    page.drawImage(image, {
      x: (A4_WIDTH - width) / 2,
      y: (A4_HEIGHT - height) / 2,
      width,
      height,
    });
  }

  const outBytes = await pdf.save();
  return new Blob([outBytes], { type: "application/pdf" });
}
