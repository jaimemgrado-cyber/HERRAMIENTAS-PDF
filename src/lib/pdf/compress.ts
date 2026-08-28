import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "low" | "medium" | "high";

/**
 * Compresión de PDF 100% client-side.
 *
 * LIMITACIÓN HONESTA: pdf-lib no permite re-codificar imágenes JPEG/PNG
 * incrustadas con una calidad distinta desde el navegador de forma fiable
 * para todos los PDFs. Esta implementación:
 *   1. Reconstruye el PDF usando object streams (reduce el overhead de la
 *      estructura interna del documento).
 *   2. Elimina metadatos innecesarios.
 * En documentos con imágenes de alta resolución, la reducción real de
 * tamaño puede ser modesta. Para compresión agresiva de imágenes se
 * necesitaría un motor de servidor (p. ej. Ghostscript), que queda fuera
 * del MVP y documentado como pendiente (ver README).
 */
export async function compressPdf(file: File, _level: CompressionLevel = "medium"): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });

  // Elimina metadatos que no aportan valor y ocupan espacio.
  pdf.setTitle("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("PDF Tools");
  pdf.setCreator("PDF Tools");

  const outBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return new Blob([outBytes], { type: "application/pdf" });
}
