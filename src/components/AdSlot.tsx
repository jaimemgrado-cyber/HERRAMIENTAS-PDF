interface AdSlotProps {
  placement: "homepage" | "tool-page" | "content-page";
}

/** Espacio reservado para Google AdSense. No depende de cuentas ni suscripciones. */
export default function AdSlot({ placement }: AdSlotProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!adsenseClientId) {
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
