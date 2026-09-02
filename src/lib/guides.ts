export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  toolSlug: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
};

export const GUIDES: Guide[] = [
  { slug: "como-unir-pdf", title: "Cómo unir varios PDF en uno", description: "Aprende a combinar varios archivos PDF en un solo documento, ordenar las páginas y descargar el resultado.", h1: "Cómo unir varios PDF en uno", intro: "Si tienes varios documentos que deben formar un único archivo, puedes combinarlos directamente desde el navegador. Esta guía explica el proceso paso a paso.", toolSlug: "merge-pdf", sections: [
    { heading: "Cuándo conviene unir PDF", paragraphs: ["Unir documentos es útil para preparar solicitudes, entregar documentación o reunir varias partes de un mismo proyecto en un solo archivo.", "Antes de unirlos, revisa el orden de los documentos para que el resultado final tenga una estructura lógica."] },
    { heading: "Cómo hacerlo", paragraphs: ["Abre la herramienta Unir PDF, selecciona los archivos y ordénalos. Después ejecuta la combinación y descarga el documento resultante.", "El procesamiento de esta herramienta se realiza en el navegador, por lo que el archivo original no necesita enviarse a un servidor."] },
  ], faqs: [{ question: "¿Puedo cambiar el orden de los PDF?", answer: "Sí. Puedes ordenar los archivos antes de iniciar la combinación." }, { question: "¿Cuesta dinero unir PDF?", answer: "La herramienta dispone de un uso gratuito dentro de los límites del plan Free." }] },
  { slug: "como-comprimir-pdf", title: "Cómo comprimir un PDF", description: "Guía para reducir el tamaño de un archivo PDF y facilitar su envío o almacenamiento.", h1: "Cómo comprimir un PDF", intro: "Un PDF demasiado pesado puede ser difícil de enviar por correo o subir a una plataforma. Comprimirlo puede reducir su tamaño sin necesidad de instalar software.", toolSlug: "compress-pdf", sections: [
    { heading: "Por qué pesa tanto un PDF", paragraphs: ["Las imágenes, fuentes incrustadas y otros recursos pueden hacer que un documento ocupe mucho espacio.", "El resultado de la compresión depende del contenido original: dos PDF del mismo número de páginas pueden reducirse de forma muy distinta."] },
    { heading: "Pasos para comprimirlo", paragraphs: ["Selecciona el archivo, elige el nivel de compresión disponible y genera una nueva versión. Comprueba el tamaño final antes de compartirla."] },
  ], faqs: [{ question: "¿La compresión siempre reduce mucho el archivo?", answer: "No. La reducción depende de cómo esté construido el PDF y del contenido que tenga." }] },
  { slug: "como-dividir-pdf", title: "Cómo dividir un PDF por páginas", description: "Aprende a separar un PDF en varios documentos usando rangos de páginas.", h1: "Cómo dividir un PDF por páginas", intro: "Cuando solo necesitas una parte de un documento, dividir el PDF evita tener que compartir el archivo completo.", toolSlug: "split-pdf", sections: [
    { heading: "Cuándo dividir un PDF", paragraphs: ["Es útil para separar capítulos, extraer secciones de un informe o enviar solo las páginas necesarias."] },
    { heading: "Cómo hacerlo", paragraphs: ["Sube el PDF, define los rangos de páginas y genera los documentos resultantes. Después puedes descargar cada parte."] },
  ], faqs: [{ question: "¿Puedo crear más de dos archivos?", answer: "Sí. Puedes definir varios rangos para separar el documento en distintas partes." }] },
  { slug: "como-convertir-jpg-a-pdf", title: "Cómo convertir JPG a PDF", description: "Convierte una o varias imágenes JPG en un documento PDF desde el navegador.", h1: "Cómo convertir JPG a PDF", intro: "Convertir imágenes a PDF es práctico para entregar fotografías, escaneos o varias capturas como un único documento.", toolSlug: "jpg-to-pdf", sections: [
    { heading: "Convierte varias imágenes en un documento", paragraphs: ["Puedes seleccionar varias imágenes y decidir el orden en el que aparecerán en el PDF final."] },
    { heading: "Pasos", paragraphs: ["Selecciona las imágenes JPG, ordénalas y ejecuta la conversión. Cada imagen se coloca en una página del documento resultante."] },
  ], faqs: [{ question: "¿Puedo convertir varias imágenes a la vez?", answer: "Sí. Las imágenes seleccionadas se pueden reunir en un único PDF." }] },
  { slug: "como-convertir-pdf-a-jpg", title: "Cómo convertir PDF a JPG", description: "Convierte las páginas de un PDF en imágenes JPG individuales de forma sencilla.", h1: "Cómo convertir PDF a JPG", intro: "Si necesitas usar las páginas de un documento como imágenes, puedes convertirlas a JPG directamente desde el navegador.", toolSlug: "pdf-to-jpg", sections: [
    { heading: "Cuándo usar PDF a JPG", paragraphs: ["Es útil para compartir una página como imagen, insertar contenido en otras aplicaciones o trabajar con documentos que necesitan un formato gráfico."] },
    { heading: "Cómo hacerlo", paragraphs: ["Selecciona el PDF y ejecuta la conversión. La herramienta genera una imagen JPG por cada página y las reúne para facilitar la descarga."] },
  ], faqs: [{ question: "¿Se genera un JPG por página?", answer: "Sí. El resultado contiene una imagen JPG por cada página del PDF." }] },
  { slug: "como-rotar-pdf", title: "Cómo rotar páginas de un PDF", description: "Aprende a girar páginas de un PDF 90, 180 o 270 grados.", h1: "Cómo rotar páginas de un PDF", intro: "Si un documento tiene páginas giradas o escaneadas en la orientación incorrecta, puedes corregirlas sin modificar el contenido.", toolSlug: "rotate-pdf", sections: [
    { heading: "Rotar solo lo necesario", paragraphs: ["No todos los documentos necesitan girarse por completo. Puedes seleccionar las páginas que requieren una orientación diferente."] },
    { heading: "Pasos", paragraphs: ["Sube el PDF, selecciona las páginas y el ángulo de rotación y genera la nueva versión."] },
  ], faqs: [{ question: "¿Puedo girar una sola página?", answer: "Sí. Puedes elegir páginas concretas." }] },
  { slug: "como-eliminar-paginas-pdf", title: "Cómo eliminar páginas de un PDF", description: "Elimina páginas innecesarias de un documento PDF antes de compartirlo.", h1: "Cómo eliminar páginas de un PDF", intro: "Eliminar páginas puede ayudarte a compartir solo la información relevante y reducir el número de páginas del documento.", toolSlug: "delete-pages", sections: [
    { heading: "Cuándo eliminar páginas", paragraphs: ["Es útil cuando un documento contiene anexos, borradores o páginas que no deben formar parte de la versión final."] },
    { heading: "Pasos", paragraphs: ["Selecciona el PDF, indica qué páginas quieres quitar y genera una nueva versión para descargar."] },
  ], faqs: [{ question: "¿Se modifica el archivo original?", answer: "No. Se genera una nueva versión del documento." }] },
  { slug: "como-extraer-paginas-pdf", title: "Cómo extraer páginas de un PDF", description: "Extrae páginas concretas de un PDF para crear un documento independiente.", h1: "Cómo extraer páginas de un PDF", intro: "Si necesitas conservar solo algunas páginas de un documento, extraerlas puede ser más práctico que compartir el archivo completo.", toolSlug: "extract-pages", sections: [
    { heading: "Extraer frente a dividir", paragraphs: ["Extraer es especialmente útil cuando quieres seleccionar páginas concretas y crear un nuevo documento con ellas."] },
    { heading: "Pasos", paragraphs: ["Carga el PDF, indica las páginas que quieres conservar y genera el nuevo documento."] },
  ], faqs: [{ question: "¿Puedo elegir páginas no consecutivas?", answer: "La herramienta permite trabajar con las páginas que necesites según las opciones disponibles en el selector." }] },
  { slug: "como-reordenar-paginas-pdf", title: "Cómo reordenar páginas de un PDF", description: "Cambia el orden de las páginas de un documento PDF antes de descargarlo.", h1: "Cómo reordenar páginas de un PDF", intro: "Una página fuera de lugar puede hacer que un documento sea difícil de leer. Reordenarlas permite preparar una versión final más clara.", toolSlug: "reorder-pages", sections: [
    { heading: "Cuándo reordenar páginas", paragraphs: ["Es útil después de escanear documentos, combinar archivos o corregir el orden de un informe."] },
    { heading: "Pasos", paragraphs: ["Carga el documento, cambia el orden de las páginas y genera el PDF actualizado."] },
  ], faqs: [{ question: "¿Se conserva el contenido?", answer: "Sí. La operación cambia la posición de las páginas sin editar su contenido." }] },
  { slug: "como-convertir-png-a-pdf", title: "Cómo convertir PNG a PDF", description: "Convierte imágenes PNG a PDF y reúne varias imágenes en un solo documento.", h1: "Cómo convertir PNG a PDF", intro: "Puedes convertir imágenes PNG a un documento PDF para compartirlas o archivarlas en un formato común.", toolSlug: "png-to-pdf", sections: [
    { heading: "Varias imágenes en un PDF", paragraphs: ["Selecciona varias imágenes para reunirlas en un único documento, respetando el orden que elijas."] },
    { heading: "Qué ocurre con la transparencia", paragraphs: ["Las zonas transparentes de las imágenes se convierten a fondo blanco para adaptarlas al documento PDF."] },
  ], faqs: [{ question: "¿Puedo convertir varias imágenes?", answer: "Sí. Puedes reunir varias imágenes PNG en un único PDF." }] },
];

export function getGuideBySlug(slug: string) { return GUIDES.find((guide) => guide.slug === slug); }
