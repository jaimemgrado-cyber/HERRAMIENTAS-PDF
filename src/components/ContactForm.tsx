"use client";

import { useState } from "react";

const CONTACT_EMAIL = "support.digitaltools@gmail.com";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const subject = String(data.subject || "Consulta sobre PDF Tools");
    const body = [
      `Nombre: ${String(data.name || "")}`,
      `Email: ${String(data.email || "")}`,
      "",
      String(data.message || ""),
    ].join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[PDF Tools] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl2 border border-line bg-white p-6 text-center">
        <p className="font-medium text-ink">Gracias por escribirnos</p>
        <p className="mt-1 text-sm text-ink-soft">Se abrirá tu aplicación de correo para enviar el mensaje a nuestro equipo de soporte.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot anti-spam: invisible para personas */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink">
          Asunto
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-accent">
          No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
