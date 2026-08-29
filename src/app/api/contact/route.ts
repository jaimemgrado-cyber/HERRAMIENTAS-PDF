import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(),
});

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );

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
    return NextResponse.json(
      { error: "Datos del formulario no válidos." },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.error("[contact] Faltan variables de entorno de email.");

    return NextResponse.json(
      { error: "No se ha podido enviar el mensaje." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const { name, email, subject, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: "PDF Tools <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: email,
    subject: `[PDF Tools] ${subject}`,
    text: `Nuevo mensaje de contacto

Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}
`,
  });

  if (error) {
    console.error("[contact] Error enviando email:", error);

    return NextResponse.json(
      { error: "No se ha podido enviar el mensaje." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
