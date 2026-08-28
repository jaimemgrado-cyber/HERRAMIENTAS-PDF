// Copia el worker de pdf.js (build clásico, NO módulo ES) a /public para que
// se sirva como archivo estático plano y Next.js/webpack nunca intente
// analizarlo ni empaquetarlo como parte del grafo de módulos de la app.
//
// Por qué es necesario: pdfjs-dist expone tanto una build ESM (.mjs, con
// `import`/`export` a nivel superior) como una build clásica (.js, sin
// sintaxis de módulos). Si el worker se referencia con
// `new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)`,
// webpack intenta procesar ese archivo como parte del bundle, y si su
// configuración de módulos no reconoce el archivo como ESM, falla con
// "'import' and 'export' may only appear at the top level" / "cannot be
// used outside of module code" durante `next build`. Sirviendo el worker
// clásico como asset estático evitamos por completo que webpack lo toque.
//
// Este script se ejecuta automáticamente tras `npm install` (ver
// package.json → "postinstall"), tanto en local como en Vercel.

const fs = require("fs");
const path = require("path");

const SOURCE = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.js"
);

const DEST_DIR = path.join(__dirname, "..", "public", "pdfjs");
const DEST = path.join(DEST_DIR, "pdf.worker.min.js");

try {
  if (!fs.existsSync(SOURCE)) {
    console.warn(
      "[copy-pdf-worker] No se ha encontrado " +
        SOURCE +
        ". Comprueba que 'pdfjs-dist' esté instalado (npm install) y que la " +
        "versión siga publicando 'build/pdf.worker.min.js'. La herramienta " +
        "PDF → JPG no funcionará hasta que este archivo exista en /public/pdfjs/."
    );
    process.exit(0); // No bloqueamos la instalación por esto.
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });
  fs.copyFileSync(SOURCE, DEST);
  console.log("[copy-pdf-worker] Worker de pdf.js copiado a public/pdfjs/pdf.worker.min.js");
} catch (err) {
  console.warn("[copy-pdf-worker] No se pudo copiar el worker de pdf.js:", err.message);
  process.exit(0);
}
