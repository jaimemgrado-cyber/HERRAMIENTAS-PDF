interface AdSlotProps {
  placement: "homepage" | "tool-page" | "content-page";
  /** El servidor determina esto a partir de la suscripción real del usuario, nunca del cliente. */
  isProUser?: boolean;
}

/**
 * Espacio reservado para Google AdSense. No carga ningún script de
 * publicidad todavía (NEXT_PUBLIC_ADSENSE_CLIENT_ID vacío = desactivado).
 * Los usuarios PRO nunca ven anuncios.
 */
export default function AdSlot({ placement, isProUser = false }: AdSlotProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (isProUser || !adsenseClientId) {
    return null;
  }

  return (
    <div
      data-ad-placement={placement}
      aria-hidden
      className="my-6 flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-line bg-white text-xs text-ink-soft"
    >
      Espacio publicitario
    </div>
  );
}
