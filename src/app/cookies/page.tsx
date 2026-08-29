import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies utiliza PDF Tools y cómo puedes gestionarlas.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Cookies", href: "/cookies" },
        ]}
      />

      <h1 className="font-display text-3xl font-semibold text-ink">
        Política de cookies
      </h1>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>¿Qué son las cookies?</h2>
        <p>
          Son pequeños archivos que se almacenan en tu navegador para recordar
          información entre visitas.
        </p>

        <h2>Cookies que utilizamos</h2>

        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>¿Requiere consentimiento?</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Necesarias</td>
              <td>
                Recordar tu sesión y tus preferencias de cookies.
              </td>
              <td>No</td>
            </tr>

            <tr>
              <td>Analítica</td>
              <td>
                Medir el uso del sitio de forma agregada. Esta categoría se
                activa únicamente cuando corresponde según tus preferencias.
              </td>
              <td>Sí</td>
            </tr>

            <tr>
              <td>Publicidad</td>
              <td>
                Mostrar anuncios relevantes mediante Google AdSense cuando
                este servicio esté activado y hayas dado el consentimiento
                necesario.
              </td>
              <td>Sí</td>
            </tr>
          </tbody>
        </table>

        <h2>Cómo gestionar tus preferencias</h2>

        <p>
          Puedes cambiar tus preferencias de cookies utilizando las opciones
          disponibles en el sitio. También puedes gestionar o eliminar las
          cookies desde la configuración de tu navegador.
        </p>

        <h2>Cookies de terceros</h2>

        <p>
          Cuando se utilizan servicios de terceros, estos pueden instalar sus
          propias cookies o tecnologías similares conforme a sus respectivas
          políticas de privacidad y condiciones.
        </p>
      </div>
    </div>
  );
}
