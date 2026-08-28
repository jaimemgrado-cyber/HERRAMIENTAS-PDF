import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  // Campo honeypot: invisible para personas, los bots lo rellenan.
  website: z.string().max(0).optional(),
});

// Rate limiting muy simple en memoria (por proceso). En producción con
// múltiples instancias, sustituir por un almacén compartido (p. ej. Redis).
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo de nuevo en un minuto." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos del formulario no válidos." }, { status: 400 });
  }

  if (parsed.data.website) {
    // El honeypot está relleno: probablemente es un bot. Respondemos OK
    // para no darle pistas, pero no procesamos el mensaje.
    return NextResponse.json({ ok: true });
  }

  // TODO: conectar con el proveedor de email transaccional configurado en
  // .env (EMAIL_*). Por ahora, en ausencia de proveedor, solo registramos
  // en logs del servidor para no perder el mensaje durante el desarrollo.
  // No se almacena el mensaje de forma indefinida en base de datos.
  // eslint-disable-next-line no-console
  console.info("[contact] Nuevo mensaje de contacto", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
  });

  return NextResponse.json({ ok: true });
}
