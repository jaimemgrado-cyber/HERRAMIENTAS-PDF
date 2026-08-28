import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PRO_PRICE_DISPLAY } from "@/lib/plan-limits";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso del servicio PDF Tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Términos", href: "/terms" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-ink-soft">
        [REQUIERE REVISIÓN LEGAL antes del lanzamiento]. Última actualización: [FECHA].
      </p>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>1. Objeto</h2>
        <p>
          Estas condiciones regulan el uso del sitio web y las herramientas ofrecidas por
          [EMPRESA / NOMBRE DEL TITULAR] (en adelante, "PDF Tools").
        </p>

        <h2>2. Uso del servicio</h2>
        <p>
          El servicio se ofrece para procesar archivos PDF e imágenes de tu propiedad o sobre los
          que tengas autorización para tratarlos. Queda prohibido usar el servicio para subir,
          generar o distribuir contenido ilegal, que infrinja derechos de terceros, o para
          actividades fraudulentas.
        </p>

        <h2>3. Cuentas de usuario</h2>
        <p>
          Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda
          actividad realizada desde tu cuenta.
        </p>

        <h2>4. Planes y pagos</h2>
        <p>
          El plan Free es gratuito y está sujeto a los límites indicados en la página de precios.
          El plan Pro tiene un coste de {PRO_PRICE_DISPLAY} (impuestos donde corresponda), se
          renueva automáticamente cada mes y puede cancelarse en cualquier momento desde tu panel
          de usuario; la cancelación surtirá efecto al final del periodo ya pagado.
        </p>
        <p>
          Los pagos se procesan a través de Stripe. [REQUIERE REVISIÓN LEGAL: política de
          reembolsos definitiva y, si aplica, información sobre el derecho de desistimiento para
          consumidores de la UE en la contratación de servicios digitales].
        </p>

        <h2>5. Disponibilidad del servicio</h2>
        <p>
          Hacemos un esfuerzo razonable por mantener el servicio disponible, pero no garantizamos
          una disponibilidad ininterrumpida. Podemos suspender el servicio temporalmente por
          mantenimiento o causas de fuerza mayor.
        </p>

        <h2>6. Propiedad intelectual</h2>
        <p>
          El contenido y diseño del sitio son propiedad de [EMPRESA / NOMBRE DEL TITULAR] o de sus
          licenciantes. No se cede ningún derecho sobre los archivos que subas o proceses; siguen
          siendo de tu propiedad.
        </p>

        <h2>7. Responsabilidad</h2>
        <p>
          El servicio se presta "tal cual". No garantizamos que el resultado de cada herramienta
          sea perfecto en todos los casos (por ejemplo, la compresión puede variar según el
          contenido del archivo). No somos responsables de los daños derivados de un uso indebido
          del servicio.
        </p>

        <h2>8. Modificaciones</h2>
        <p>
          Podemos modificar estas condiciones. Publicaremos la versión actualizada en esta misma
          página con la fecha de la última actualización.
        </p>

        <h2>9. Cancelación de cuenta</h2>
        <p>
          Puedes solicitar la cancelación de tu cuenta en cualquier momento escribiendo a [EMAIL DE
          CONTACTO].
        </p>

        <h2>10. Contacto</h2>
        <p>Para cualquier duda sobre estas condiciones, escríbenos a [EMAIL DE CONTACTO].</p>
      </div>
    </div>
  );
}
