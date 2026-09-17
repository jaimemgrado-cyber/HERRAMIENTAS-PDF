"use client";

import { useState } from "react";

const CONTACT_EMAIL = "support.digitaltools@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.delete("website");

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error("FormSubmit rejected the message");
      }

      form.reset();
      setStatus("sent");
    } catch (error) {
      console.error("[contact] Error enviando formulario:", error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl2 border border-line bg-white p-6 text-center">
        <p className="font-medium text-ink">Mensaje enviado correctamente</p>
        <p className="mt-1 text-sm text-ink-soft">
          Hemos recibido tu mensaje y te responderemos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-accent underline underline-offset-4"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <input type="hidden" name="_subject" value="Nuevo mensaje de contacto — PDF Tools" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_template" value="table" />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">Nombre</label>
        <input id="name" name="name" type="text" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink">Asunto</label>
        <input id="subject" name="subject" type="text" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">Mensaje</label>
        <textarea id="message" name="message" rows={5} required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent" />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-accent">
          No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50">
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
