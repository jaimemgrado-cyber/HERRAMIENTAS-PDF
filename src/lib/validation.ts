/**
 * Validación de archivos en el cliente.
 *
 * IMPORTANTE: esto es una primera barrera de UX, NO una medida de seguridad
 * suficiente por sí sola para endpoints de servidor. Cualquier endpoint que
 * reciba archivos en el futuro DEBE repetir esta validación en el servidor
 * (comprobando "magic bytes" reales, no solo el MIME type reportado por el
 * navegador, que puede falsificarse).
 */

// Firma binaria ("magic bytes") de un PDF: siempre empieza por "%PDF-".
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d];
const JPG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

async function readMagicBytes(file: File, length: number): Promise<Uint8Array> {
  const buf = await file.slice(0, length).arrayBuffer();
  return new Uint8Array(buf);
}

function matchesMagic(bytes: Uint8Array, magic: number[]): boolean {
  return magic.every((b, i) => bytes[i] === b);
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function validatePdfFile(file: File, maxSizeMB: number): Promise<ValidationResult> {
  if (file.size === 0) {
    return { valid: false, error: "El archivo está vacío." };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `El archivo supera el límite de ${maxSizeMB} MB de tu plan actual.`,
    };
  }
  const bytes = await readMagicBytes(file, 5);
  if (!matchesMagic(bytes, PDF_MAGIC)) {
    return {
      valid: false,
      error: "Este archivo no es un PDF válido. Comprueba que no esté dañado.",
    };
  }
  return { valid: true };
}

export async function validateImageFile(
  file: File,
  type: "jpg" | "png",
  maxSizeMB: number
): Promise<ValidationResult> {
  if (file.size === 0) {
    return { valid: false, error: "El archivo está vacío." };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `El archivo supera el límite de ${maxSizeMB} MB de tu plan actual.`,
    };
  }
  const bytes = await readMagicBytes(file, 4);
  const magic = type === "jpg" ? JPG_MAGIC : PNG_MAGIC;
  if (!matchesMagic(bytes, magic)) {
    return {
      valid: false,
      error: `Este archivo no parece ser una imagen ${type.toUpperCase()} válida.`,
    };
  }
  return { valid: true };
}

export function friendlyErrorMessage(_error: unknown): string {
  // Nunca exponemos mensajes técnicos internos al usuario.
  return "Este archivo no ha podido procesarse. Comprueba que no esté dañado e inténtalo de nuevo.";
}
