# PDF Tools

Web de herramientas PDF online gratuitas. No requiere registro, inicio de sesión ni suscripción. El procesamiento de las herramientas compatibles se realiza en el navegador, de forma local.

## Desarrollo

Requisitos: Node.js >= 18.18 y npm.

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm start
```

## Herramientas

Incluye herramientas para unir, dividir, comprimir, convertir, rotar, extraer, eliminar y reordenar páginas de PDF, además de convertir imágenes JPG/PNG a PDF.

## Privacidad

Las herramientas compatibles con procesamiento local no envían los archivos a un servidor para realizar la operación. El límite de tamaño configurado en `src/lib/file-limits.ts` es un límite técnico del navegador, no un límite de un plan de pago.

## Configuración

Las variables opcionales están documentadas en `.env.example`. La publicidad y la analítica permanecen desactivadas si sus variables no están configuradas.
