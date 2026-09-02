"use client";

import { useState } from "react";
import clsx from "clsx";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  /** Usa esto para un enlace simple (p. ej. el plan Free). */
  ctaHref?: string;
  /**
   * Usa esto para el plan Pro: llama a nuestra API, que crea una sesión de
   * Stripe Checkout y redirige al usuario allí. No requiere cuenta previa.
   */
  checkoutEndpoint?: string;
}

export default function PricingCard({
  name,
  price,
  period = "/mes",
  features,
  highlighted = false,
  ctaLabel,
  ctaHref,
  checkoutEndpoint,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!checkoutEndpoint) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(checkoutEndpoint, { method: "POST" });
      const body = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/pricing";
        return;
      }
      if (!res.ok || !body.url) {
        throw new Error(body.error ?? "No se ha podido iniciar el pago.");
      }
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
      setLoading(false);
    }
  };

  const buttonClasses = clsx(
    "mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50",
    highlighted ? "bg-accent text-white hover:bg-accent/90" : "bg-ink text-white hover:bg-ink/90"
  );

  return (
    <div
      className={clsx(
        "flex flex-col rounded-xl2 border p-8",
        highlighted ? "border-accent bg-white shadow-card" : "border-line bg-white/60"
      )}
    >
      <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
      <p className="mt-2">
        <span className="font-display text-3xl font-semibold text-ink">{price}</span>
        {price !== "0 €" && <span className="text-sm text-ink-soft"> {period}</span>}
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
            <span aria-hidden className="mt-0.5 text-success">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {checkoutEndpoint ? (
        <button type="button" onClick={handleCheckout} disabled={loading} className={buttonClasses}>
          {loading ? "Redirigiendo..." : ctaLabel}
        </button>
      ) : (
        <a href={ctaHref ?? "/tools"} className={buttonClasses}>
          {ctaLabel}
        </a>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
