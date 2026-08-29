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
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Términos", href: "/terms" },
        ]}
      />

      <h1 className="font-display text-3xl font-semibold text-ink">
        Términos y condiciones
      </h1>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>1. Objeto</h2>
        <p>
          Estas condiciones regulan el uso del sitio web y de las herramientas
          ofrecidas por PDF Tools.
        </p>

        <h2>2. Uso del servicio</h2>
        <p>
          El servicio está destinado al procesamiento de archivos PDF e
          imágenes que sean propiedad del usuario o sobre los que tenga
          autorización para realizar el tratamiento correspondiente.
        </p>

        <p>
          No está permitido utilizar el servicio para subir, generar o
          distribuir contenido ilegal, infringir derechos de terceros o
          realizar actividades fraudulentas.
        </p>

        <h2>3. Cuentas de usuario</h2>
        <p>
          El usuario es responsable de mantener la confidencialidad de sus
          credenciales de acceso y de la actividad realizada desde su cuenta.
        </p>

        <h2>4. Planes y pagos</h2>
        <p>
          El plan Free es gratuito y está sujeto a los límites indicados en la
          página de precios.
        </p>

        <p>
          El plan Pro tiene un coste de {PRO_PRICE_DISPLAY} y se renueva
          automáticamente según las condiciones de la suscripción. El usuario
          puede gestionar y cancelar su suscripción desde las opciones
          disponibles en su cuenta.
        </p>

        <p>
          Los pagos se procesan mediante Stripe. Las condiciones aplicables a
          pagos, reembolsos y derechos de los consumidores se regirán por la
          normativa aplicable y por las condiciones mostradas durante el
          proceso de contratación.
        </p>

        <h2>5. Disponibilidad del servicio</h2>
        <p>
          Se realizan esfuerzos razonables para mantener el servicio
          disponible, pero no se garantiza una disponibilidad ininterrumpida.
          El servicio puede suspenderse temporalmente por mantenimiento,
          actualizaciones o circunstancias que impidan su funcionamiento
          normal.
        </p>

        <h2>6. Propiedad intelectual</h2>
        <p>
          Los contenidos y elementos propios del sitio están protegidos por la
          normativa aplicable en materia de propiedad intelectual.
        </p>

        <p>
          Los archivos que el usuario suba o procese siguen perteneciendo al
          usuario o a sus respectivos titulares. El uso de PDF Tools no
          implica la transferencia de los derechos sobre dichos archivos.
        </p>

        <h2>7. Responsabilidad</h2>
        <p>
          Las herramientas pueden producir resultados diferentes dependiendo
          de las características de cada archivo. El usuario debe comprobar
          los resultados obtenidos antes de utilizarlos para fines importantes.
        </p>

        <p>
          El usuario debe utilizar el servicio de forma responsable y de
          acuerdo con la legislación aplicable.
        </p>

        <h2>8. Modificaciones</h2>
        <p>
          Estas condiciones pueden modificarse cuando resulte necesario.
          Cualquier versión actualizada se publicará en esta misma página.
        </p>

        <h2>9. Cancelación de cuenta</h2>
        <p>
          El usuario puede cancelar su cuenta utilizando las opciones
          disponibles en el servicio.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para consultas relacionadas con estas condiciones, puedes utilizar
          la página de <a href="/contact">Contacto</a>.
        </p>
      </div>
    </div>
  );
}
