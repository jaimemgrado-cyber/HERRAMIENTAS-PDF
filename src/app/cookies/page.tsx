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
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Cookies", href: "/cookies" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Política de cookies</h1>

      <div className="prose prose-slate mt-8 max-w-none text-ink-soft">
        <h2>¿Qué son las cookies?</h2>
        <p>
          Son pequeños archivos que se almacenan en tu navegador para recordar información entre
          visitas.
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
              <td>Recordar tu sesión y tus preferencias de cookies.</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Analítica</td>
              <td>
                Medir el uso del sitio de forma agregada (activada solo si aceptas esta
                categoría). [REQUIERE INFORMACIÓN DEL PROPIETARIO: nombre del proveedor de
                analítica realmente utilizado].
              </td>
              <td>Sí</td>
            </tr>
            <tr>
              <td>Publicidad</td>
              <td>
                Mostrar anuncios relevantes a través de Google AdSense (solo si aceptas esta
                categoría y el sitio tiene AdSense activado).
              </td>
              <td>Sí</td>
            </tr>
          </tbody>
        </table>

        <h2>Cómo gestionar tus preferencias</h2>
        <p>
          Puedes cambiar tu decisión en cualquier momento borrando la preferencia guardada en tu
          navegador o, cuando esté disponible, mediante el enlace &quot;Configurar cookies&quot; del banner
          que aparece al visitar el sitio.
        </p>

        <h2>Cookies de terceros</h2>
        <p>
          Si activamos servicios de analítica o publicidad, estos proveedores podrían instalar sus
          propias cookies conforme a sus propias políticas de privacidad. [REQUIERE INFORMACIÓN
          DEL PROPIETARIO: listar proveedores concretos una vez contratados].
        </p>
      </div>
    </div>
  );
}
