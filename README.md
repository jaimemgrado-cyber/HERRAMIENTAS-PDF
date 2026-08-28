# PDF Tools

Plataforma de herramientas PDF construida con Next.js 14 (App Router), TypeScript y Tailwind
CSS, lista para desplegarse en Vercel. Preparada para monetización con Google AdSense y
suscripción PDF Pro mediante Stripe Checkout.

## ⚠️ Nota sobre la verificación del build

Este proyecto se ha generado y revisado en un entorno **sin acceso a red** (no se puede
contactar con el registro de npm). Por tanto:

- **No ha sido posible ejecutar `npm install` ni `npm run build` en el entorno donde se generó
  este código.** No se afirma un resultado de build que no se ha podido comprobar realmente.
- En su lugar, se ha hecho una revisión manual exhaustiva: todos los imports (`@/...` y
  relativos) se han verificado uno por uno contra el sistema de archivos real, se ha comprobado
  que cada componente que usa hooks de React o manejadores de eventos tiene la directiva
  `"use client"`, que cada ruta `/tools/<slug>` referencia un slug que existe en
  `src/lib/tools-config.ts`, y que no queda ningún import roto ni ninguna clave con forma de
  secreto real en el repositorio.
- **Antes de desplegar, ejecuta tú mismo:**

  ```bash
  npm install
  npm run build
  ```

  Si tu versión de Node o npm difiere sensiblemente de la usada aquí (Node ≥ 18.18), o si alguna
  versión menor de una dependencia ha cambiado desde que se escribió este código, corrige
  cualquier error de tipos que pueda aparecer siguiendo el mensaje del compilador — la
  arquitectura y la lógica de negocio no deberían necesitar cambios.

## Qué es este proyecto

Una plataforma tipo iLovePDF/Smallpdf con diseño propio. Todas las herramientas prioritarias
procesan los archivos **en el navegador del usuario** (con `pdf-lib` y `pdf.js`), por lo que los
PDF del usuario no se suben a ningún servidor para estas operaciones.

Para mantener el número de dependencias (y por tanto el riesgo de build) al mínimo, **esta
versión no incluye cuentas de usuario ni base de datos**. El plan Pro se contrata directamente
mediante Stripe Checkout (Stripe recoge el email del cliente en su propio formulario alojado).
Ver la sección [Próximos pasos](#próximos-pasos-fase-2--cuentas-de-usuario) para cómo añadir
cuentas más adelante sin rehacer la arquitectura.

## Herramientas disponibles

| Herramienta | Ruta |
|---|---|
| Unir PDF | `/tools/merge-pdf` |
| Dividir PDF | `/tools/split-pdf` |
| Comprimir PDF | `/tools/compress-pdf` |
| JPG a PDF | `/tools/jpg-to-pdf` |
| PNG a PDF | `/tools/png-to-pdf` |
| PDF a JPG | `/tools/pdf-to-jpg` |
| Rotar PDF | `/tools/rotate-pdf` |
| Eliminar páginas | `/tools/delete-pages` |
| Extraer páginas | `/tools/extract-pages` |
| Ordenar páginas | `/tools/reorder-pages` |

Todas están completamente funcionales: seleccionar/arrastrar archivo, validar, procesar y
descargar el resultado.

## Páginas

`/`, `/tools` (listado), las 10 herramientas de arriba, `/pricing`, `/about`, `/contact`,
`/legal`, `/privacy`, `/cookies`, `/terms`, `/success`, `/cancel`.

## Arquitectura

```
src/
  app/
    tools/<slug>/       Una página por herramienta (SEO individual + UI funcional)
    api/stripe/         checkout (crea sesión) y webhook (verifica firma)
    api/contact/        Formulario de contacto (con honeypot + rate limiting básico)
  components/           UI reutilizable
    tools/               Componente cliente de cada herramienta (lógica de interacción)
  lib/
    pdf/                Procesamiento PDF real, 100% client-side
    tools-config.ts     Fuente única de verdad de herramientas + textos SEO
    plan-limits.ts       Fuente única de verdad de límites FREE/PRO
    stripe.ts            Cliente de Stripe (solo servidor)
    validation.ts         Validación de archivos por contenido real (magic bytes)
```

- **UI** → `src/components/`
- **Páginas y rutas** → `src/app/`
- **Lógica de negocio / procesamiento de archivos** → `src/lib/pdf/`
- **Pagos** → `src/lib/stripe.ts`, `src/app/api/stripe/*`
- **Configuración** → variables de entorno + `src/lib/tools-config.ts` / `plan-limits.ts`
- **SEO** → metadata por página, `src/app/sitemap.ts`, `src/app/robots.ts`
- **Páginas legales** → `src/app/{privacy,cookies,terms,legal}/page.tsx`

### Por qué procesamiento client-side

Las 10 herramientas usan [`pdf-lib`](https://github.com/Hopding/pdf-lib) y
[`pdf.js`](https://mozilla.github.io/pdf.js/) directamente en el navegador:

- El archivo del usuario nunca sale de su dispositivo para estas operaciones.
- Elimina de raíz una categoría entera de riesgos de seguridad (almacenamiento temporal,
  limpieza de archivos, acceso cruzado entre usuarios) para estas herramientas.
- Menor coste de infraestructura.

**Límite conocido:** sin un motor de servidor (p. ej. Ghostscript), la compresión de PDF
(`src/lib/pdf/compress.ts`) no puede re-comprimir agresivamente imágenes incrustadas; solo
optimiza la estructura interna del documento. Esto está documentado en el propio código y en la
página de la herramienta, sin prometer una reducción de tamaño que no se puede garantizar.

## Instalación

Requisitos: Node.js ≥ 18.18, npm.

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` con tus propios valores. Para desarrollo, basta con dejar las variables de
Stripe vacías: la web funciona igualmente, y el botón "Hazte Pro" mostrará un error controlado
en vez de romper la aplicación.

## Ejecutar en local

```bash
npm run dev
```

Abre http://localhost:3000.

## Desplegar en Vercel

1. Sube el contenido de este repositorio a GitHub/GitLab/Bitbucket.
2. Impórtalo en [vercel.com/new](https://vercel.com/new).
3. Configura las variables de `.env.example` en Project Settings → Environment Variables.
4. Despliega (Vercel ejecuta `npm run build` automáticamente, con acceso a red completo).

## Configurar Stripe en modo test

1. Crea una cuenta en [stripe.com](https://stripe.com) y activa el **modo test**.
2. **Productos** → crea "PDF Pro" con un precio recurrente mensual (p. ej. 4,99 €).
3. Copia el **Price ID** (`price_...`) a `STRIPE_PRO_PRICE_ID`.
4. En **Desarrolladores → Claves de API**, copia `pk_test_...` y `sk_test_...` a
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` y `STRIPE_SECRET_KEY`.
5. Prueba el botón "Hazte Pro" en `/pricing` con una
   [tarjeta de prueba](https://stripe.com/docs/testing) (`4242 4242 4242 4242`, cualquier fecha
   futura, cualquier CVC). **Nunca uses una tarjeta real en modo test.**

## Configurar el webhook de Stripe

En local, con la [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia el `whsec_...` que te da la CLI a `STRIPE_WEBHOOK_SECRET`.

En producción, crea un endpoint de webhook en el Dashboard de Stripe apuntando a
`https://<tu-dominio>/api/stripe/webhook`, suscrito a: `checkout.session.completed`,
`customer.subscription.created`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`. El endpoint ya
verifica la firma; por ahora solo registra el evento (ver siguiente sección para conectarlo a
una base de datos real).

## Próximos pasos (fase 2: cuentas de usuario)

Esta versión no incluye login ni base de datos. Para añadir cuentas más adelante:

1. Añade `next-auth` (o el proveedor de auth que prefieras) y una base de datos (Prisma +
   Postgres es una combinación habitual).
2. En `src/app/api/stripe/checkout/route.ts`, asocia la sesión de Checkout al usuario
   autenticado (`client_reference_id` / `metadata`) y crea/reutiliza un `Stripe Customer`.
3. En `src/app/api/stripe/webhook/route.ts`, sustituye el `console.info` por la escritura real
   en base de datos del estado de la suscripción (plan, estado, fecha de renovación).
4. Crea una función `getUserPlan(userId)` que consulte esa tabla y úsala en servidor para decidir
   si el usuario ve anuncios (`AdSlot`) o tiene acceso a funciones Pro — **nunca** confíes en un
   valor de "premium" calculado en el cliente.

Las variables `DATABASE_URL`, `AUTH_SECRET` y `NEXTAUTH_URL` ya están documentadas (comentadas)
en `.env.example` para cuando llegue este momento.

## Cómo añadir una nueva herramienta

1. Añade una entrada en `src/lib/tools-config.ts` (slug, categoría, textos SEO, FAQs, pasos).
2. Crea la función de procesamiento en `src/lib/pdf/<nombre>.ts`.
3. Crea el componente de interacción en `src/components/tools/<Nombre>Tool.tsx`, reutilizando
   `UploadZone`, `FileList`, `ProgressBar`, `DownloadButton`, `ErrorMessage`.
4. Crea `src/app/tools/<slug>/page.tsx` usando `ToolPageShell` (copia una página existente como
   plantilla) — el sitemap se actualiza automáticamente porque recorre `TOOLS`.

## Cómo cambiar precios

El precio se gestiona en Stripe, no en el código: crea un nuevo Price en el Dashboard de Stripe,
actualiza `STRIPE_PRO_PRICE_ID`, y opcionalmente ajusta el texto `PRO_PRICE_DISPLAY` en
`src/lib/plan-limits.ts` (es solo el texto mostrado en la UI; el cobro real siempre lo determina
Stripe).

## Cómo cambiar límites del plan

Edita `FREE_MAX_FILE_SIZE_MB`, `FREE_DAILY_OPERATIONS`, `PRO_MAX_FILE_SIZE_MB`,
`PRO_DAILY_OPERATIONS` en tus variables de entorno. Todo el código lee estos valores desde
`src/lib/plan-limits.ts`.

## Cómo cambiar el nombre de la marca

1. Cambia `NEXT_PUBLIC_BRAND_NAME` en tus variables de entorno.
2. Sustituye el favicon/logo en `public/` y el icono "PT" en `src/components/Header.tsx`.
3. Revisa las páginas legales, que usan placeholders como `[EMPRESA / NOMBRE DEL TITULAR]`.

## Cómo cambiar el dominio

Cambia `NEXT_PUBLIC_APP_URL` en producción. El SEO (canonical, sitemap, Open Graph) se genera
dinámicamente a partir de esta variable.

## Cómo activar publicidad más adelante

1. Solicita Google AdSense para tu dominio ya en producción.
2. Añade tu client-id a `NEXT_PUBLIC_ADSENSE_CLIENT_ID`. Los espacios (`AdSlot`) ya están
   reservados y se ocultan automáticamente mientras la variable esté vacía.
3. Actualiza la Content-Security-Policy en `next.config.js` para permitir los dominios de
   AdSense.

## Seguridad

- Ningún secreto real está incluido en este repositorio; `.env.example` solo contiene
  placeholders con forma claramente no válida (`REPLACE_WITH_...`), no cadenas con el prefijo
  `sk_test_`/`pk_test_`/`whsec_` seguidas de caracteres, para evitar cualquier falso positivo de
  escáneres de secretos de GitHub.
- `.gitignore` excluye `.env`, `.env.local` y cualquier `.env.*.local`.
- Cabeceras de seguridad HTTP + Content-Security-Policy en `next.config.js`.
- Validación de archivos por contenido real (magic bytes), no solo por extensión
  (`src/lib/validation.ts`).
- El webhook de Stripe verifica la firma de cada petición antes de procesarla.

## Qué NO está listo para producción

- Cuentas de usuario / login (ver "Próximos pasos" arriba).
- Activación real de pagos: Stripe sigue en modo test hasta que actives claves `live`.
- Páginas legales con placeholders (`[EMPRESA / NOMBRE DEL TITULAR]`, `[NIF/CIF]`, etc.) — ver
  [`LEGAL_CHECKLIST.md`](./LEGAL_CHECKLIST.md).
- Envío real de emails transaccionales.
- Google AdSense (requiere aprobación de Google con el dominio real).
- Herramientas que requerirían servidor (Word/Excel↔PDF, OCR, firma electrónica): no incluidas
  en esta versión.

## Dependencias principales

| Paquete | Uso |
|---|---|
| `next`, `react` | Framework y UI |
| `tailwindcss` | Estilos |
| `pdf-lib` | Unir, dividir, rotar, comprimir, extraer/eliminar/ordenar páginas, imágenes→PDF |
| `pdfjs-dist` | Renderizar páginas PDF a imagen (PDF→JPG) |
| `jszip` | Empaquetar varias imágenes en un ZIP descargable |
| `stripe` | Checkout y verificación de webhooks |
| `zod` | Validación de datos en la API de contacto |
| `clsx` | Utilidad de clases condicionales |
