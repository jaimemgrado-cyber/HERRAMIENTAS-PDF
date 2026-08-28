# Checklist pre-lanzamiento

Repasa esta lista completa antes de anunciar el lanzamiento en producción.

## TÉCNICO

- [ ] `npm run build` termina sin errores.
- [ ] `npm run lint` sin errores.
- [ ] Sitio servido bajo HTTPS (automático en Vercel con dominio propio configurado).
- [ ] Todas las variables de entorno de `.env.example` configuradas en producción (Vercel →
      Project Settings → Environment Variables).
- [ ] Dominio definitivo configurado y `NEXT_PUBLIC_APP_URL` / `NEXTAUTH_URL` actualizados.
- [ ] `sitemap.xml` accesible en `/sitemap.xml` y sin errores.
- [ ] `robots.txt` accesible en `/robots.txt` y con las reglas correctas.
- [ ] Enviado el sitemap a Google Search Console (y Bing Webmaster Tools si procede).
- [ ] Favicon y iconos (`public/favicon.ico`, `public/icon.png`) sustituidos por los definitivos.
- [ ] Open Graph / Twitter Cards revisados con una herramienta de previsualización (p. ej.
      https://www.opengraph.xyz/).
- [ ] Analítica conectada (si procede) y respetando el consentimiento de cookies.
- [ ] Backups automáticos configurados en el proveedor de base de datos.
- [ ] Monitorización básica de errores configurada (p. ej. Vercel Analytics/Logs o un servicio
      externo).

## SEGURIDAD

- [ ] Ningún secreto (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) está presente en el
      repositorio ni en el bundle del cliente.
- [ ] Cabeceras de seguridad activas (`next.config.js`) verificadas con
      https://securityheaders.com/.
- [ ] Rate limiting del formulario de contacto sustituido por un almacén compartido si se
      despliega en múltiples instancias/regiones.
- [ ] Validación de archivos por contenido real (magic bytes) revisada para cada herramienta.
- [ ] Límites de tamaño de archivo aplicados y probados en el cliente.
- [ ] Verificación de firma del webhook de Stripe probada con un evento real (no solo en local).
- [ ] Confirmado que `profiles`/`usage_daily` tienen RLS activado y que un usuario autenticado
      no puede leer ni escribir filas de otro usuario (probar con dos cuentas distintas).
- [ ] Confirmado que `SUPABASE_SERVICE_ROLE_KEY` no aparece en ningún archivo del repositorio ni
      se importa fuera de `src/lib/supabase/admin.ts` / el webhook de Stripe.
- [ ] Comprobado manualmente que un usuario FREE no puede obtener acceso PRO manipulando el
      cliente (DevTools, interceptando la respuesta de `/api/usage/status`, etc.): el plan
      siempre debe leerse de `profiles.plan` en servidor.

## LEGAL

- [ ] `/legal` revisado con datos reales del titular.
- [ ] `/privacy` revisado con datos reales y proveedores reales.
- [ ] `/cookies` revisado con las cookies realmente utilizadas.
- [ ] `/terms` revisado, idealmente por un profesional legal.
- [ ] Todos los puntos de [`LEGAL_CHECKLIST.md`](./LEGAL_CHECKLIST.md) completados.
- [ ] Condiciones de suscripción, cancelación y reembolso confirmadas.
- [ ] Información de precios e impuestos confirmada.

## PAGOS

- [ ] Flujo de Checkout probado en Stripe **modo test** con un usuario real registrado: pago
      correcto, pago cancelado, cancelación de suscripción, renovación, acceso PRO concedido y
      acceso PRO revocado tras cancelación/impago (comprobando `profiles.plan` en Supabase).
- [ ] Webhook probado en producción con el endpoint real (no solo con la Stripe CLI en local).
- [ ] Customer Portal de Stripe configurado (Dashboard → Settings → Billing → Customer Portal)
      si se quiere permitir a los usuarios gestionar/cancelar su suscripción ellos mismos.
- [ ] Antes de aceptar pagos reales: cambiar las claves de test por las claves `live`
      correspondientes y volver a configurar el webhook de producción con el secreto `live`.
- [ ] Facturación e impuestos configurados en Stripe (Stripe Tax u otra solución) si aplica.

## SEO

- [ ] Titles y descriptions únicos revisados en todas las páginas indexables.
- [ ] Canonicals correctos (sin duplicados).
- [ ] Sitemap actualizado automáticamente al añadir nuevas herramientas.
- [ ] Robots.txt no bloquea páginas que deberían indexarse.
- [ ] Enlazado interno revisado (herramientas relacionadas, footer).
- [ ] Datos estructurados (`BreadcrumbList`, `FAQPage`, `WebSite`) validados con
      https://search.google.com/test/rich-results.
- [ ] Sitio revisado en un lector de accesibilidad / auditoría Lighthouse (mobile friendly,
      Core Web Vitals, accesibilidad ≥ 90).
