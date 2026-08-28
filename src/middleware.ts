import { type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    /*
     * Se ejecuta en todas las páginas EXCEPTO assets estáticos y rutas de
     * API (/api/*). Excluir /api/ es imprescindible: este middleware
     * reenvía la petición a través de la capa Edge antes de llegar al
     * Route Handler, lo que puede alterar los bytes exactos del body.
     * Para la mayoría de rutas de API no supone un problema, pero para
     * /api/stripe/webhook es fatal — Stripe firma el body byte a byte, y
     * cualquier alteración (aunque sea invisible) hace que
     * stripe.webhooks.constructEvent() rechace la firma con "Firma
     * inválida.", incluso con STRIPE_WEBHOOK_SECRET correcto. Ninguna
     * ruta de API de este proyecto necesita el refresco de sesión que
     * hace este middleware: cada una crea su propio cliente de Supabase
     * con las cookies de la petición (ver src/lib/supabase/server.ts).
     */
    "/((?!_next/static|_next/image|favicon.ico|pdfjs/|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
