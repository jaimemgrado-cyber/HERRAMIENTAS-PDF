# Checklist legal — datos que debes proporcionar antes de lanzar

Este documento enumera toda la información real que **debes** proporcionar (o hacer revisar por
un profesional) antes de lanzar PDF Tools en producción. Ningún dato de este listado ha sido
inventado en el código: todos aparecen como placeholders (`[EMPRESA / NOMBRE DEL TITULAR]`,
`[NIF/CIF]`, etc.) que debes sustituir manualmente.

> ⚠️ Este documento **no sustituye el asesoramiento de un abogado o gestor**. Está pensado como
> lista de comprobación técnica de qué falta, no como validación legal.

## 1. Identidad del titular

- [ ] Nombre o razón social — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] NIF/CIF — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Domicilio social/fiscal — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Email de contacto legal — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Dominio definitivo — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Datos registrales (si aplica: Registro Mercantil, epígrafe IAE, etc.) — **REQUIERE
      INFORMACIÓN DEL PROPIETARIO**

Dónde actualizar: `src/app/legal/page.tsx`, `src/app/privacy/page.tsx`,
`src/components/Footer.tsx`, `src/app/contact/page.tsx`.

## 2. Datos fiscales

- [ ] Régimen fiscal aplicable (autónomo, sociedad, etc.) — **REQUIERE REVISIÓN LEGAL**
- [ ] Tipo de IVA/impuesto aplicable a la suscripción PDF Pro según país del cliente — **REQUIERE
      REVISIÓN LEGAL** (especialmente si vendes a clientes de varios países de la UE: régimen de
      IVA en servicios digitales / OSS)
- [ ] Si corresponde, alta en el régimen de ventanilla única (OSS) para IVA de servicios
      digitales en la UE — **REQUIERE REVISIÓN LEGAL**

## 3. Proveedores utilizados

Documenta aquí los proveedores reales que uses, para reflejarlos en la política de privacidad y
de cookies:

- [ ] Proveedor de hosting/despliegue (p. ej. Vercel) — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Proveedor de base de datos y autenticación: Supabase (ya en uso) — confirmar que la
      región del proyecto de Supabase y su política de retención de datos son adecuadas.
- [ ] Proveedor de pagos: Stripe (ya integrado)
- [ ] Proveedor de email transaccional (si se activa) — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Proveedor de analítica (si se activa) — **REQUIERE INFORMACIÓN DEL PROPIETARIO**
- [ ] Proveedor de publicidad: Google AdSense (si se activa)

Dónde actualizar: `src/app/privacy/page.tsx` (sección 5), `src/app/cookies/page.tsx`.

## 4. Política de conservación y eliminación de archivos

- [ ] Para las herramientas client-side (la mayoría en el MVP): confirmar que el texto "no se
      suben tus archivos a ningún servidor" sigue siendo cierto en el código antes de cada
      lanzamiento.
- [ ] Si en el futuro se añade una herramienta server-side (Word→PDF, OCR, etc.), definir y
      documentar el plazo exacto de eliminación automática de archivos temporales, y actualizar
      la política de privacidad con ese plazo real (actualmente marcado como **REQUIERE REVISIÓN
      LEGAL** porque no debe prometerse un plazo no garantizado técnicamente).

## 5. Precios definitivos

- [ ] Confirmar el precio final del plan Pro (actualmente configurado como referencia en
      `4,99 €/mes`, ver `PRO_PRICE_DISPLAY` en `src/lib/plan-limits.ts` — el precio real siempre
      lo determina el Price configurado en Stripe).
- [ ] Confirmar si el precio mostrado incluye o excluye impuestos, y ajustar Stripe Tax /
      configuración de impuestos en consecuencia. — **REQUIERE REVISIÓN LEGAL**

## 6. Condiciones de suscripción

- [ ] Confirmar la política de renovación automática y cómo se comunica al usuario (ya reflejada
      de forma genérica en `/terms` y `/pricing`).
- [ ] Confirmar la política de reembolsos — **REQUIERE REVISIÓN LEGAL**
- [ ] Confirmar si aplica derecho de desistimiento de 14 días para consumidores de la UE en la
      contratación de contenido/servicios digitales, y cómo se informa de la renuncia a ese
      derecho al iniciar el uso inmediato del servicio — **REQUIERE REVISIÓN LEGAL**

## 7. Cookies reales utilizadas

- [ ] Listar cookies exactas (nombre, finalidad, duración, si son de origen propio o de terceros)
      una vez estén activados los proveedores de analítica/publicidad reales. — **REQUIERE
      INFORMACIÓN DEL PROPIETARIO**

Dónde actualizar: `src/app/cookies/page.tsx`.

## 8. Revisión profesional recomendada

- [ ] Revisión de `/terms` (términos y condiciones) por un abogado, especialmente en lo relativo
      a suscripciones, pagos, reembolsos y limitación de responsabilidad.
- [ ] Revisión de `/privacy` (política de privacidad) para cumplimiento RGPD/LOPDGDD conforme a
      los proveedores y tratamientos reales que finalmente utilices.
- [ ] Revisión de `/legal` (aviso legal) conforme a la Ley de Servicios de la Sociedad de la
      Información (LSSI) española.
- [ ] Confirmación de si necesitas registrar el tratamiento de datos o realizar una evaluación de
      impacto (EIPD) según el volumen y tipo de datos que acabes tratando.

---

**Regla general aplicada en el código:** ningún dato de empresa, NIF, domicilio, precio o
garantía técnica se ha inventado. Todo lo pendiente está marcado explícitamente como
`[PLACEHOLDER]`, **REQUIERE INFORMACIÓN DEL PROPIETARIO** o **REQUIERE REVISIÓN LEGAL** en el
propio código y en las páginas legales.
