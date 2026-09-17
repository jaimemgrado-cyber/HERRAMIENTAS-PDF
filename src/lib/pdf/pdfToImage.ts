import JSZip from "jszip";

/**
 * Renderiza cada página de un PDF como imagen JPG usando pdf.js sobre un
 * <canvas>, y empaqueta el resultado en un ZIP. Todo ocurre en el navegador.
 *
 * NOTA IMPORTANTE sobre el worker de pdf.js (evita el error de build
 * "'import'/'export' no se pueden usar fuera del código del módulo"):
 *
 * El error se produce porque `new URL("pdfjs-dist/build/pdf.worker.min.mjs",
 * import.meta.url)` obliga a webpack a tratar ese archivo como un chunk más
 * que debe empaquetar y minificar. El worker de pdf.js es un módulo ES
 * (contiene `import`/`export` de alto nivel) pero el chunk que genera
 * webpack para él no se emite en formato de módulo, así que el proceso de
 * minificado del build falla al encontrarse esa sintaxis.
 *
 * La solución: dejar que webpack siga empaquetando normalmente la librería
 * principal de pdfjs-dist (import habitual, sin tocar), pero servir el
 * WORKER como un archivo estático plano desde `/public`, referenciado con
 * una simple cadena de texto. Al vivir en `public/`, Next.js lo sirve tal
 * cual: webpack no lo analiza, no lo empaqueta y no lo minifica, así que no
 * hay nada que pueda romper el build. El archivo se copia automáticamente
 * a `public/pdfjs/pdf.worker.min.js` tras `npm install` (ver
 * `scripts/copy-pdf-worker.js` y el hook "postinstall" en package.json),
 * usando la build clásica (no-módulo) del worker que pdfjs-dist 3.x sigue
 * publicando junto a la moderna en ES modules.
 */
export async function pdfToJpgZip(file: File, quality = 0.85): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

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
