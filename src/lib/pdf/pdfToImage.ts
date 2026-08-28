import JSZip from "jszip";

/**
 * Renderiza cada página de un PDF como imagen JPG usando pdf.js sobre un
 * <canvas>, y empaqueta el resultado en un ZIP. Todo ocurre en el navegador.
 *
 * pdfjs-dist se importa dinámicamente porque depende de un Web Worker y de
 * APIs del navegador (no debe evaluarse en el servidor).
 */
export async function pdfToJpgZip(file: File, quality = 0.85): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const bytes = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;

  const zip = new JSZip();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo crear el contexto de canvas");

    await page.render({ canvasContext: context, viewport }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))),
        "image/jpeg",
        quality
      );
    });

    const paddedNum = String(pageNum).padStart(3, "0");
    zip.file(`pagina-${paddedNum}.jpg`, blob);
  }

  return zip.generateAsync({ type: "blob" });
}
