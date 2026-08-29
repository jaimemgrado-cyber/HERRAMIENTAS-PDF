import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Información sobre el tratamiento de datos personales y archivos en PDF Tools.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Privacidad", href: "/privacy" },
        ]}
      />

      <h1 className="font-display text-3xl font-semibold text-ink">
        Política de privacidad
      </h1>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>1. Responsable del tratamiento</h2>
        <p>
          Esta sección contiene información sobre el responsable del
          tratamiento de los datos personales utilizados en relación con
          PDF Tools.
        </p>

        <h2>2. Qué datos tratamos</h2>
        <p>Según el uso que hagas del servicio, podemos tratar:</p>

        <ul>
          <li>
            Datos de cuenta, como el email y la información necesaria para
            gestionar la autenticación.
          </li>
          <li>
            Datos relacionados con la suscripción y facturación cuando
            corresponda.
          </li>
          <li>
            Datos técnicos básicos necesarios para el funcionamiento y
            seguridad del servicio.
          </li>
          <li>
            Datos que nos envíes voluntariamente a través del formulario de
            contacto.
          </li>
          <li>
            Cookies y tecnologías similares, según tus preferencias y
            consentimiento cuando este sea necesario.
          </li>
        </ul>

        <h2>3. Tratamiento de tus archivos PDF</h2>

        <p>
          <strong>
            Herramientas que procesan el archivo en tu navegador
          </strong>{" "}
          (indicado en la página de cada herramienta): el archivo se procesa
          localmente en tu dispositivo y no se envía a nuestros servidores
          para realizar esa operación.
        </p>

        <p>
          Algunas funcionalidades pueden requerir procesamiento en servidor.
          En esos casos, el tratamiento de los archivos se realiza únicamente
          cuando es necesario para prestar la funcionalidad solicitada.
        </p>

        <h2>4. Finalidades y base jurídica</h2>

        <p>
          Los datos se tratan para prestar las funcionalidades solicitadas,
          gestionar las cuentas de usuario y suscripciones cuando
          corresponda, mantener la seguridad del servicio y cumplir las
          obligaciones legales aplicables.
        </p>

        <p>
          Cuando sea necesario, determinados tratamientos, como la analítica
          o la publicidad, estarán sujetos a las preferencias y al
          consentimiento del usuario.
        </p>

        <h2>5. Destinatarios y proveedores</h2>

        <p>
          PDF Tools puede utilizar servicios de terceros necesarios para el
          funcionamiento de la plataforma, como servicios de alojamiento,
          autenticación, procesamiento de pagos y servicios relacionados con
          publicidad o analítica cuando estén activados.
        </p>

        <h2>6. Pagos</h2>

        <p>
          Los pagos de las suscripciones se gestionan mediante proveedores
          especializados de procesamiento de pagos. Los datos completos de
          las tarjetas de pago no se almacenan directamente en los
          servidores de PDF Tools.
        </p>

        <h2>7. Conservación</h2>

        <p>
          Los datos se conservan durante el tiempo necesario para prestar el
          servicio, gestionar la relación con el usuario y cumplir las
          obligaciones legales que resulten aplicables.
        </p>

        <h2>8. Tus derechos</h2>

        <p>
          Puedes ejercer los derechos que reconozca la normativa aplicable en
          materia de protección de datos, incluyendo los derechos de acceso,
          rectificación, supresión, oposición, limitación y portabilidad
          cuando correspondan.
        </p>

        <p>
          También puedes presentar una reclamación ante la autoridad de
          protección de datos competente.
        </p>

        <h2>9. Transferencias internacionales</h2>

        <p>
          Algunos proveedores tecnológicos utilizados por el servicio pueden
          realizar tratamientos de datos fuera del Espacio Económico Europeo.
          Cuando corresponda, dichos tratamientos estarán sujetos a las
          garantías previstas por la normativa aplicable.
        </p>

        <h2>10. Seguridad</h2>

        <p>
          Aplicamos medidas técnicas y organizativas razonables destinadas a
          proteger los datos frente a accesos, alteraciones, pérdidas o usos
          no autorizados.
        </p>

        <h2>11. Contacto</h2>

        <p>
          Para consultas relacionadas con esta política o con el tratamiento
          de datos personales, puedes utilizar la página de{" "}
          <a href="/contact">Contacto</a>.
        </p>
      </div>
    </div>
  );
}
