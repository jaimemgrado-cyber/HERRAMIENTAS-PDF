// Fuente única de verdad para todas las herramientas.
// Añadir una herramienta nueva = añadir una entrada aquí + su implementación
// en src/lib/pdf/ + su página en src/app/tools/<slug>/page.tsx.
// Ver README.md → "Cómo añadir una nueva herramienta".

export type ToolCategory = "organization" | "conversion" | "optimization";

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  processing: "client";
  acceptedTypes: string[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  organization: "Organización de PDF",
  conversion: "Conversión de PDF",
  optimization: "Optimización de PDF",
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Unir PDF",
    shortDescription: "Combina varios archivos PDF en uno solo, en el orden que elijas.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Unir PDF online gratis | PDF Tools",
    metaDescription:
      "Combina varios archivos PDF en un único documento, gratis y sin instalar nada. El proceso se realiza en tu navegador.",
    h1: "Unir PDF online",
    intro:
      "Selecciona dos o más archivos PDF, ordénalos como necesites y únelos en un solo documento. Todo el proceso ocurre en tu propio navegador: los archivos no se envían a ningún servidor.",
    steps: [
      "Arrastra o selecciona los archivos PDF que quieres unir.",
      "Ordena los archivos arrastrándolos en la lista.",
      "Pulsa \"Unir PDF\" y espera unos segundos.",
      "Descarga el archivo combinado.",
    ],
    faqs: [
      {
        question: "¿Se suben mis archivos a un servidor?",
        answer:
          "No. Unir PDF se procesa completamente en tu navegador. Los archivos nunca salen de tu dispositivo.",
      },
      {
        question: "¿Cuántos archivos puedo unir a la vez?",
        answer: "Puedes unir tantos archivos como quieras, dentro del límite de tamaño de tu plan.",
      },
    ],
  },
  {
    slug: "split-pdf",
    name: "Dividir PDF",
    shortDescription: "Divide un PDF en varios archivos por rangos de páginas.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Dividir PDF online gratis | PDF Tools",
    metaDescription:
      "Divide un archivo PDF en varios documentos por rango de páginas, directamente desde tu navegador.",
    h1: "Dividir PDF online",
    intro:
      "Sube un PDF, indica en qué páginas quieres dividirlo y descarga los documentos resultantes. El procesamiento es local, en tu navegador.",
    steps: [
      "Sube el archivo PDF que quieres dividir.",
      "Indica el rango o los puntos de corte.",
      "Pulsa \"Dividir PDF\".",
      "Descarga los archivos resultantes.",
    ],
    faqs: [
      {
        question: "¿Puedo dividir un PDF en más de dos partes?",
        answer: "Sí, puedes definir varios rangos para obtener tantos archivos como necesites.",
      },
    ],
  },
  {
    slug: "compress-pdf",
    name: "Comprimir PDF",
    shortDescription: "Reduce el tamaño de tu PDF optimizando su estructura interna.",
    category: "optimization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Comprimir PDF online gratis | PDF Tools",
    metaDescription:
      "Reduce el peso de tus archivos PDF directamente desde tu navegador, sin instalar software.",
    h1: "Comprimir PDF online",
    intro:
      "Esta herramienta reduce el tamaño de tu PDF optimizando la estructura interna del documento. El nivel de reducción depende del contenido: un PDF con muchas imágenes se reducirá de forma distinta a uno de solo texto.",
    steps: [
      "Sube el PDF que quieres comprimir.",
      "Elige un nivel de compresión.",
      "Pulsa \"Comprimir PDF\".",
      "Descarga el archivo optimizado.",
    ],
    faqs: [
      {
        question: "¿Se pierde calidad al comprimir?",
        answer:
          "El texto no se ve afectado. La reducción de tamaño depende de la estructura y las imágenes del documento original.",
      },
      {
        question: "¿Cuánto se reduce el tamaño?",
        answer: "Depende completamente del contenido del PDF original.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG a PDF",
    shortDescription: "Convierte una o varias imágenes JPG en un documento PDF.",
    category: "conversion",
    processing: "client",
    acceptedTypes: ["image/jpeg"],
    metaTitle: "Convertir JPG a PDF online gratis | PDF Tools",
    metaDescription:
      "Convierte tus imágenes JPG en un archivo PDF, gratis y desde el navegador, sin subir tus fotos a ningún servidor.",
    h1: "Convertir JPG a PDF",
    intro:
      "Sube una o varias imágenes JPG y las convertiremos en un único documento PDF, respetando el orden que elijas.",
    steps: [
      "Sube una o varias imágenes JPG.",
      "Ordénalas si es necesario.",
      "Pulsa \"Convertir a PDF\".",
      "Descarga el PDF resultante.",
    ],
    faqs: [
      {
        question: "¿Puedo combinar varias imágenes en un solo PDF?",
        answer: "Sí, cada imagen se coloca en una página independiente, en el orden que elijas.",
      },
    ],
  },
  {
    slug: "png-to-pdf",
    name: "PNG a PDF",
    shortDescription: "Convierte una o varias imágenes PNG en un documento PDF.",
    category: "conversion",
    processing: "client",
    acceptedTypes: ["image/png"],
    metaTitle: "Convertir PNG a PDF online gratis | PDF Tools",
    metaDescription: "Convierte tus imágenes PNG en un archivo PDF, gratis y desde el navegador.",
    h1: "Convertir PNG a PDF",
    intro:
      "Sube una o varias imágenes PNG y las convertiremos en un único documento PDF conservando la transparencia como fondo blanco.",
    steps: [
      "Sube una o varias imágenes PNG.",
      "Ordénalas si es necesario.",
      "Pulsa \"Convertir a PDF\".",
      "Descarga el PDF resultante.",
    ],
    faqs: [
      {
        question: "¿Qué pasa con la transparencia del PNG?",
        answer: "Las zonas transparentes se convierten a fondo blanco, ya que el PDF no admite transparencia de la misma forma.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF a JPG",
    shortDescription: "Convierte cada página de tu PDF en una imagen JPG.",
    category: "conversion",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Convertir PDF a JPG online gratis | PDF Tools",
    metaDescription:
      "Convierte las páginas de tu PDF en imágenes JPG individuales, directamente desde el navegador.",
    h1: "Convertir PDF a JPG",
    intro: "Sube tu PDF y generaremos una imagen JPG por cada página, lista para descargar en un archivo ZIP.",
    steps: [
      "Sube el PDF que quieres convertir.",
      "Pulsa \"Convertir a JPG\".",
      "Descarga las imágenes (ZIP).",
    ],
    faqs: [
      {
        question: "¿Se genera una imagen o varias?",
        answer: "Se genera una imagen JPG por cada página del PDF original, empaquetadas en un ZIP.",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotar PDF",
    shortDescription: "Rota todas las páginas o solo algunas de tu PDF.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Rotar PDF online gratis | PDF Tools",
    metaDescription: "Rota páginas de tu PDF 90, 180 o 270 grados, sin instalar nada.",
    h1: "Rotar páginas de un PDF",
    intro: "Sube tu PDF, elige el ángulo de rotación y aplica el cambio a todas las páginas o solo a las que necesites.",
    steps: [
      "Sube el PDF.",
      "Selecciona las páginas y el ángulo de rotación.",
      "Pulsa \"Rotar PDF\".",
      "Descarga el archivo actualizado.",
    ],
    faqs: [
      { question: "¿Puedo rotar solo una página?", answer: "Sí, puedes elegir qué páginas rotar de forma individual." },
    ],
  },
  {
    slug: "delete-pages",
    name: "Eliminar páginas",
    shortDescription: "Elimina las páginas que no necesitas de tu PDF.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Eliminar páginas de un PDF online gratis | PDF Tools",
    metaDescription: "Elimina páginas concretas de tu PDF y descarga el documento resultante.",
    h1: "Eliminar páginas de un PDF",
    intro: "Sube tu PDF, indica qué páginas quieres eliminar y descarga el documento resultante.",
    steps: [
      "Sube el PDF.",
      "Indica las páginas que quieres eliminar.",
      "Pulsa \"Eliminar páginas\".",
      "Descarga el PDF resultante.",
    ],
    faqs: [
      {
        question: "¿Puedo deshacer la eliminación?",
        answer: "El archivo original no se modifica: siempre puedes volver a subirlo si necesitas empezar de nuevo.",
      },
    ],
  },
  {
    slug: "extract-pages",
    name: "Extraer páginas",
    shortDescription: "Extrae páginas concretas de tu PDF en un nuevo documento.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Extraer páginas de un PDF online gratis | PDF Tools",
    metaDescription: "Extrae las páginas que necesites de un PDF y descárgalas como un nuevo documento.",
    h1: "Extraer páginas de un PDF",
    intro: "Sube tu PDF, indica qué páginas quieres conservar y descarga un nuevo documento solo con ellas.",
    steps: [
      "Sube el PDF.",
      "Indica las páginas que quieres extraer.",
      "Pulsa \"Extraer páginas\".",
      "Descarga el nuevo PDF.",
    ],
    faqs: [
      {
        question: "¿En qué se diferencia de \"Eliminar páginas\"?",
        answer: "\"Extraer páginas\" conserva solo las páginas seleccionadas; \"Eliminar páginas\" conserva todas menos las seleccionadas.",
      },
    ],
  },
  {
    slug: "reorder-pages",
    name: "Ordenar páginas",
    shortDescription: "Reordena las páginas de tu PDF en el orden que necesites.",
    category: "organization",
    processing: "client",
    acceptedTypes: ["application/pdf"],
    metaTitle: "Ordenar páginas de un PDF online gratis | PDF Tools",
    metaDescription: "Cambia el orden de las páginas de tu PDF de forma sencilla.",
    h1: "Ordenar páginas de un PDF",
    intro: "Sube tu PDF e indica el nuevo orden de sus páginas.",
    steps: [
      "Sube el PDF.",
      "Indica el nuevo orden de las páginas.",
      "Pulsa \"Guardar orden\".",
      "Descarga el PDF reordenado.",
    ],
    faqs: [],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}
