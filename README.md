# PDF Tools

Plataforma de herramientas PDF construida con Next.js 14 (App Router), TypeScript y Tailwind
CSS, lista para desplegarse en Vercel. Cuentas de usuario con Supabase Auth, límite de uso
diario verificado en servidor, y suscripción PDF Pro mediante Stripe Checkout.

## ⚠️ Nota sobre la verificación del build

Este proyecto se ha generado y revisado en un entorno **sin acceso a red** (no se puede
contactar con el registro de npm ni con Supabase/Stripe). Por tanto:

- **No ha sido posible ejecutar `npm install` ni `npm run build`** en el entorno donde se
  escribió este código. No se afirma un resultado de build que no se ha podido comprobar
  realmente.
- Sí se ha hecho una revisión manual exhaustiva: todos los imports (`@/...` y relativos) se han
  verificado uno por uno contra el sistema de archivos real, que cada componente con hooks/
  eventos tiene `"use client"`, que `src/lib/supabase/admin.ts` (service role) solo lo importa
  el webhook de Stripe, y que ningún componente cliente importa el cliente de servidor de
  Supabase.
- **Antes de desplegar, ejecuta tú mismo:**

  ```bash
  npm install
  npm run build
  ```

  y aplica la migración SQL (ver más abajo) antes de probar login/registro/límites, o fallarán
  con errores de tablas inexistentes.

## Qué es este proyecto

Una plataforma tipo iLovePDF/Smallpdf con diseño propio. Las 10 herramientas procesan los
archivos **en el navegador del usuario** (con `pdf-lib` y `pdf.js`) — los PDF nunca se suben a
un servidor para esas operaciones.

Por encima de eso, hay un sistema real de cuentas:

- **Supabase Auth** gestiona el registro/login con email y contraseña.
- Cada usuario tiene una fila en `profiles` con su plan (`free`/`pro`).
- El límite de **3 operaciones/día (free) o 1000/día (pro)** se comprueba y se incrementa
  **en el servidor**, de forma atómica, nunca en el navegador.
- **Stripe** gestiona el cobro de la suscripción Pro; su webhook es la única fuente de verdad
  que actualiza el plan del usuario en la base de datos.

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

Cada una exige sesión iniciada para procesar (el límite se aplica por cuenta, no por navegador).
Se puede subir/previsualizar el archivo sin sesión, pero el botón de procesar queda sustituido
por un aviso para iniciar sesión o registrarse hasta que hay usuario autenticado.

## Páginas

`/`, `/tools` (listado), las 10 herramientas de arriba, `/pricing`, `/about`, `/contact`,
`/legal`, `/privacy`, `/cookies`, `/terms`, `/login`, `/register`, `/success`, `/cancel`.

## Arquitectura

```
src/
  app/
    tools/<slug>/         Una página por herramienta (SEO individual + UI funcional)
    login/, register/     Páginas de autenticación
    auth/callback/        Intercambia el código de confirmación de email por una sesión
    api/usage/status/     GET  — snapshot de uso actual, sin consumir
    api/usage/consume/    POST — comprueba el límite y lo incrementa de forma atómica
    api/stripe/checkout/  POST — crea la sesión de Stripe Checkout (exige sesión)
    api/stripe/webhook/   POST — única fuente de verdad que actualiza el plan del usuario
    api/auth/signout/     POST — cierra sesión
    api/contact/          Formulario de contacto (honeypot + rate limiting básico)
  components/
    tools/                 Componente cliente de cada herramienta
    Header.tsx              Server Component: muestra sesión/plan o login/registro
  lib/
    pdf/                  Procesamiento PDF real, 100% client-side
    supabase/
      client.ts             Cliente de navegador (Client Components)
      server.ts              Cliente de servidor (Server Components/Route Handlers)
      admin.ts                 Cliente service_role — SOLO lo importa el webhook
      middleware.ts             Refresco de sesión (usado por src/middleware.ts)
    usage-limit.ts          Wrappers fetch sobre /api/usage/* (sin lógica de negocio)
    useUsageLimit.ts          Hook de React reutilizado por las 10 herramientas
    tools-config.ts         Fuente única de verdad de herramientas + textos SEO
    plan-limits.ts            Fuente única de verdad de límites FREE/PRO
    stripe.ts                  Cliente de Stripe (solo servidor)
supabase/migrations/0001_init.sql   Migración SQL — tablas, RLS y funciones RPC
```

- **UI** → `src/components/`
- **Páginas y rutas** → `src/app/`
- **Lógica de negocio / procesamiento de archivos** → `src/lib/pdf/`
- **Autenticación** → `src/lib/supabase/*`, `src/middleware.ts`, `/login`, `/register`
- **Límite de uso** → `src/app/api/usage/*` + función SQL `consume_operation`
- **Pagos** → `src/lib/stripe.ts`, `src/app/api/stripe/*`
- **Configuración** → variables de entorno + `src/lib/tools-config.ts` / `plan-limits.ts`
- **SEO** → metadata por página, `src/app/sitemap.ts`, `src/app/robots.ts`
- **Páginas legales** → `src/app/{privacy,cookies,terms,legal}/page.tsx`

### Cómo funciona el límite diario (y por qué es seguro)

1. Al cargar una herramienta, el cliente llama a `GET /api/usage/status` para mostrar "Te
   quedan N operaciones hoy" (o el aviso de iniciar sesión). Es solo lectura.
2. Al pulsar "Procesar", el cliente llama a `POST /api/usage/consume` **antes** de ejecutar el
   procesamiento real. Esa ruta llama a la función SQL `consume_operation`, que:
   - lee el plan del usuario en `profiles.plan` (nunca se envía el plan desde el cliente),
   - bloquea la fila de uso del día (`FOR UPDATE`) para que dos peticiones simultáneas no puedan
     colarse ambas por debajo del límite,
   - si ya alcanzó el límite, devuelve `allowed: false` sin tocar el contador,
   - si no, incrementa el contador y devuelve `allowed: true`.
3. Solo si `allowed` es `true` se ejecuta el procesamiento PDF en el navegador.

**Trade-off explícito:** como el procesamiento en sí ocurre en el navegador (por privacidad, el
archivo nunca se sube), el servidor no puede saber si terminó bien o mal — así que lo que se
cuenta es el *intento* de procesar, no el resultado. Es el mismo compromiso que usan la mayoría
de herramientas freemium client-side; queda documentado aquí y en el propio código
(`src/app/api/usage/consume/route.ts`) en vez de ocultarlo.

El "día" se calcula en UTC (`(now() at time zone 'utc')::date` en la función SQL) porque no se
almacena la zona horaria del usuario. Se reinicia solo porque cada día es una fila distinta en
`usage_daily`; no hace falta ningún job de limpieza.

### Cómo funciona la suscripción Pro (y por qué es segura)

1. El usuario pulsa "Hazte Pro" en `/pricing` → `POST /api/stripe/checkout` (exige sesión).
2. Esa ruta crea (o reutiliza) un Stripe Customer y lo asocia a `profiles.stripe_customer_id`
   mediante la función RPC `set_stripe_customer_id` — no hace falta la service_role key aquí,
   solo la sesión del propio usuario (la función comprueba `auth.uid()` por dentro).
3. Stripe redirige a su Checkout hospedado; nosotros nunca vemos datos de tarjeta.
4. Cuando el pago se confirma, Stripe llama a `POST /api/stripe/webhook`, que verifica la firma
   y — usando el cliente **service_role** (el único sitio del proyecto que lo usa) — actualiza
   `profiles.plan` según el estado real de la suscripción: `'pro'` solo si Stripe dice
   `active`/`trialing`; cualquier otro estado (cancelada, impago, incompleta...) → `'free'`.
5. La página `/success` es solo un mensaje de cortesía: **nunca** concede acceso Pro por sí
   misma. El plan real siempre se lee de `profiles.plan`, escrito exclusivamente por el webhook.

## Instalación

Requisitos: Node.js ≥ 18.18, npm, un proyecto de Supabase y una cuenta de Stripe (modo test).

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` con tus propios valores (ver la sección de variables más abajo).

## Aplicar la migración de base de datos (Supabase)

1. Abre tu proyecto en [supabase.com](https://supabase.com) → **SQL Editor** → *New query*.
2. Copia y pega el contenido completo de
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) y pulsa *Run*.
3. Esto crea las tablas `profiles` y `usage_daily`, activa Row Level Security, crea el trigger
   que genera automáticamente un perfil al registrarse, y las funciones `consume_operation` y
   `set_stripe_customer_id`.
4. En **Authentication → Providers**, confirma que el proveedor **Email** está activado. Decide
   si quieres exigir confirmación por email (recomendado en producción) — el registro
   (`RegisterForm.tsx`) ya contempla ambos casos.
5. En **Authentication → URL Configuration**, añade `{NEXT_PUBLIC_APP_URL}/auth/callback` a las
   Redirect URLs (y la URL de producción cuando la tengas).

## Ejecutar en local

```bash
npm run dev
```

Abre http://localhost:3000. Regístrate en `/register` para poder usar cualquier herramienta.

## Desplegar en Vercel

1. Sube el contenido de este repositorio a GitHub/GitLab/Bitbucket.
2. Impórtalo en [vercel.com/new](https://vercel.com/new).
3. Configura las variables de `.env.example` en Project Settings → Environment Variables
   (incluida `SUPABASE_SERVICE_ROLE_KEY`, que es nueva — ver más abajo).
4. Despliega.
5. Añade la URL de producción a las Redirect URLs de Supabase (paso 5 de la sección anterior).
6. Crea el endpoint de webhook de Stripe apuntando a tu dominio de producción (ver más abajo).

## Configurar Stripe en modo test

1. Cuenta en [stripe.com](https://stripe.com), **modo test** activado.
2. **Productos** → crea "PDF Pro" con un precio recurrente mensual (4,99 €).
3. Copia el **Price ID** (`price_...`) a `STRIPE_PRO_PRICE_ID`.
4. Prueba "Hazte Pro" en `/pricing` (con sesión iniciada) usando una
   [tarjeta de prueba](https://stripe.com/docs/testing) (`4242 4242 4242 4242`, fecha futura,
   CVC cualquiera). **Nunca uses una tarjeta real en modo test.**
5. Comprueba en Supabase (tabla `profiles`) que `plan` pasa a `'pro'` tras el pago, y que vuelve
   a `'free'` si cancelas la suscripción desde el Dashboard de Stripe.

## Configurar el webhook de Stripe

En local, con la [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia el `whsec_...` que te da la CLI a `STRIPE_WEBHOOK_SECRET`.

En producción, crea un endpoint apuntando a `https://<tu-dominio>/api/stripe/webhook`, suscrito
a: `checkout.session.completed`, `customer.subscription.created`,
`customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`,
`invoice.payment_failed`.

## Cómo añadir una nueva herramienta

1. Añade una entrada en `src/lib/tools-config.ts` (slug, categoría, textos SEO, FAQs, pasos).
2. Crea la función de procesamiento en `src/lib/pdf/<nombre>.ts`.
3. Crea el componente de interacción en `src/components/tools/<Nombre>Tool.tsx`, reutilizando
   `UploadZone`, `FileList`, `ProgressBar`, `DownloadButton`, `ErrorMessage`, `UsageStatus`, y
   el hook `useUsageLimit()` — llama a `await usage.consume()` justo antes de procesar y solo
   continúa si `allowed` es `true` (copia el patrón de cualquier Tool existente).
4. Crea `src/app/tools/<slug>/page.tsx` usando `ToolPageShell` — el sitemap se actualiza solo.

## Cómo cambiar precios

Crea un nuevo Price en el Dashboard de Stripe, actualiza `STRIPE_PRO_PRICE_ID`, y opcionalmente
ajusta el texto `PRO_PRICE_DISPLAY` en `src/lib/plan-limits.ts` (es solo el texto mostrado en la
UI; el cobro real siempre lo determina Stripe).

## Cómo cambiar límites del plan

Edita `FREE_MAX_FILE_SIZE_MB`, `FREE_DAILY_OPERATIONS`, `PRO_MAX_FILE_SIZE_MB`,
`PRO_DAILY_OPERATIONS` en tus variables de entorno. `src/lib/plan-limits.ts` sigue siendo la
única fuente de verdad de estos números; `/api/usage/consume` se los pasa a la función SQL en
cada llamada, así que un cambio de variable de entorno se aplica sin tocar la base de datos.

## Cómo cambiar el nombre de la marca / el dominio / activar publicidad

Sin cambios respecto a antes: `NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_APP_URL` y
`NEXT_PUBLIC_ADSENSE_CLIENT_ID` respectivamente (ver comentarios en `.env.example`).

## Seguridad

- **Row Level Security** activado en `profiles` y `usage_daily`, con únicamente política de
  `SELECT` sobre la fila propia — ningún usuario puede escribir esas tablas directamente desde
  el cliente. Toda escritura pasa por funciones `SECURITY DEFINER` (que comprueban `auth.uid()`
  por dentro) o por el webhook con la service_role key.
- **`SUPABASE_SERVICE_ROLE_KEY`** solo se importa desde `src/lib/supabase/admin.ts`, y ese
  módulo solo lo usa `src/app/api/stripe/webhook/route.ts`. Nunca tiene el prefijo
  `NEXT_PUBLIC_`, así que Next.js nunca la incluye en el bundle del cliente.
- El plan del usuario **siempre** se determina en servidor (`profiles.plan`, actualizado solo
  por el webhook); ningún componente cliente decide si alguien es Pro.
- El límite diario se comprueba **e incrementa** en la misma transacción SQL (`FOR UPDATE`),
  evitando que un doble clic o varias pestañas consuman más operaciones de las debidas.
- Ningún secreto real está incluido en este repositorio; `.env.example` usa placeholders con
  forma claramente no válida (`REPLACE_WITH_...`).
- `.gitignore` excluye `.env`, `.env.local` y cualquier `.env.*.local`.
- Cabeceras de seguridad HTTP + Content-Security-Policy en `next.config.js`.
- Validación de archivos por contenido real (magic bytes), no solo por extensión.
- El webhook de Stripe verifica la firma de cada petición antes de procesarla.

## Qué NO está listo para producción

- Activación real de pagos: Stripe sigue en modo test hasta que actives claves `live`.
- Confirmación por email: revisa en Supabase si quieres exigirla antes de lanzar (afecta al
  flujo de `/register`).
- Páginas legales con placeholders (`[EMPRESA / NOMBRE DEL TITULAR]`, `[NIF/CIF]`, etc.) — ver
  [`LEGAL_CHECKLIST.md`](./LEGAL_CHECKLIST.md).
- Recuperación de contraseña / gestión de cuenta (cambiar email, borrar cuenta): no
  implementadas todavía; Supabase Auth las soporta si se añaden las páginas correspondientes.
- Envío real de emails transaccionales propios (aviso de pago fallido, etc. — Supabase ya envía
  los suyos de confirmación/recuperación si se configuran).
- Google AdSense (requiere aprobación de Google con el dominio real).
- Herramientas que requerirían servidor (Word/Excel↔PDF, OCR, firma electrónica): no incluidas.

## Dependencias principales

| Paquete | Uso |
|---|---|
| `next`, `react` | Framework y UI |
| `tailwindcss` | Estilos |
| `pdf-lib` | Unir, dividir, rotar, comprimir, extraer/eliminar/ordenar páginas, imágenes→PDF |
| `pdfjs-dist` | Renderizar páginas PDF a imagen (PDF→JPG). Fijado en `3.11.174` a propósito: sigue publicando un worker clásico (no ES module) — ver comentario en `src/lib/pdf/pdfToImage.ts`. |
| `jszip` | Empaquetar varias imágenes en un ZIP descargable |
| `stripe` | Checkout y verificación de webhooks |
| `@supabase/ssr`, `@supabase/supabase-js` | Autenticación y base de datos, con cookies compatibles con Next.js App Router |
| `zod` | Validación de datos en la API de contacto |
| `clsx` | Utilidad de clases condicionales |
