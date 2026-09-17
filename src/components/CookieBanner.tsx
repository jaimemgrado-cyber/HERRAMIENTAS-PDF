"use client";

import { useEffect, useState } from "react";

export interface CookiePreferences {
  necessary: true; // siempre activas, no se pueden desactivar
  analytics: boolean;
  advertising: boolean;
}

const STORAGE_KEY = "pdf-tools-cookie-consent";

export function getStoredConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeConsent(prefs: CookiePreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  // Notificamos al resto de la app (p. ej. para activar/desactivar analítica)
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: prefs }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    storeConsent({ necessary: true, analytics: true, advertising: true });
    setVisible(false);
  };

  const rejectAll = () => {
    storeConsent({ necessary: true, analytics: false, advertising: false });
    setVisible(false);
  };

  const saveSettings = () => {
    storeConsent({ necessary: true, analytics, advertising });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-4 shadow-[0_-8px_24px_rgba(18,33,58,0.12)] sm:p-6"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-ink-soft">
          Utilizamos cookies necesarias para el funcionamiento de la web y, si nos das permiso,
          cookies de analítica y publicidad. Puedes cambiar tu decisión en cualquier momento desde{" "}
          <a href="/cookies" className="underline hover:text-ink">
            nuestra política de cookies
          </a>
          .
        </p>

        {showSettings && (
          <div className="mt-4 space-y-3 rounded-lg border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Necesarias</span>
              <span className="text-xs text-ink-soft">Siempre activas</span>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Analítica</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Publicidad</span>
              <input
                type="checkbox"
                checked={advertising}
                onChange={(e) => setAdvertising(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent"
          >
            Aceptar
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
          >
            Rechazar
          </button>
          {showSettings ? (
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
            >
              Guardar preferencias
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
            >
              Configurar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
