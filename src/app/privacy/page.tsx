import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos personales y tus archivos en PDF Tools.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Privacidad", href: "/privacy" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Política de privacidad</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Última actualización: [FECHA]. Este documento contiene placeholders que deben
        completarse con datos reales antes del lanzamiento (ver LEGAL_CHECKLIST.md).
      </p>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>1. Responsable del tratamiento</h2>
        <p>
          [EMPRESA / NOMBRE DEL TITULAR], con NIF/CIF [NIF/CIF] y domicilio en [DIRECCIÓN], es el
          responsable del tratamiento de los datos personales recogidos a través de este sitio web.
          Puedes contactar con nosotros en [EMAIL DE CONTACTO].
        </p>

        <h2>2. Qué datos tratamos</h2>
        <p>Según el uso que hagas del servicio, podemos tratar:</p>
        <ul>
          <li>Datos de cuenta: email, nombre (si lo indicas) y contraseña (almacenada de forma cifrada, nunca en texto plano).</li>
          <li>Datos de facturación y suscripción gestionados por Stripe (ver sección 6).</li>
          <li>Datos técnicos básicos (dirección IP, tipo de navegador) necesarios para el funcionamiento y seguridad del servicio.</li>
          <li>Datos que nos envíes voluntariamente a través del formulario de contacto.</li>
          <li>Cookies y tecnologías similares, según tu consentimiento (ver /cookies).</li>
        </ul>

        <h2>3. Tratamiento de tus archivos PDF</h2>
        <p>
          <strong>Herramientas que procesan el archivo en tu navegador</strong> (indicado en la
          página de cada herramienta): el archivo no se envía a nuestros servidores en ningún
          momento. Todo el procesamiento ocurre localmente en tu dispositivo.
        </p>
        <p>
          <strong>Herramientas que requieren procesamiento en servidor</strong> (si las hubiera en
          el futuro): el archivo se sube de forma cifrada en tránsito, se procesa, y se elimina del
          almacenamiento temporal de forma automática. [REQUIERE REVISIÓN LEGAL: especificar el
          plazo exacto de conservación una vez definido técnicamente; no afirmamos un plazo
          concreto hasta que esté garantizado por el sistema].
        </p>

        <h2>4. Finalidades y base jurídica</h2>
        <p>
          Tratamos tus datos para prestarte el servicio solicitado (ejecución de un contrato),
          para cumplir obligaciones legales (facturación) y, con tu consentimiento, para fines de
          analítica y publicidad.
        </p>

        <h2>5. Destinatarios y proveedores</h2>
        <p>
          Utilizamos proveedores externos para operar el servicio, entre ellos: [PROVEEDOR DE
          HOSTING], Stripe (procesamiento de pagos), y, si están activados, [PROVEEDOR DE
          ANALÍTICA] y Google AdSense (publicidad). [REQUIERE INFORMACIÓN DEL PROPIETARIO: listar
          todos los proveedores realmente utilizados].
        </p>

        <h2>6. Pagos con Stripe</h2>
        <p>
          Los pagos se gestionan a través de Stripe. No almacenamos los datos de tu tarjeta en
          nuestros servidores. Consulta la política de privacidad de Stripe para más información.
        </p>

        <h2>7. Conservación</h2>
        <p>
          Conservamos los datos de tu cuenta mientras la mantengas activa. Los mensajes del
          formulario de contacto se conservan solo el tiempo necesario para atender tu consulta.
          [REQUIERE REVISIÓN LEGAL: plazos exactos de conservación].
        </p>

        <h2>8. Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad escribiendo a [EMAIL DE CONTACTO]. También puedes reclamar ante la Agencia
          Española de Protección de Datos (www.aepd.es).
        </p>

        <h2>9. Transferencias internacionales</h2>
        <p>
          Algunos proveedores (por ejemplo, Stripe) pueden tratar datos fuera del Espacio
          Económico Europeo, aplicando garantías adecuadas (como cláusulas contractuales tipo).
          [REQUIERE REVISIÓN LEGAL].
        </p>

        <h2>10. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. Ningún
          sistema es 100% seguro; no realizamos afirmaciones absolutas al respecto.
        </p>

        <h2>11. Contacto</h2>
        <p>Para cualquier duda sobre esta política, escríbenos a [EMAIL DE CONTACTO].</p>
      </div>
    </div>
  );
}
