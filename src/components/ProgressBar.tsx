export default function ProgressBar({ label = "Procesando..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="mt-6">
      <p className="mb-2 text-sm font-medium text-ink">{label}</p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
      </div>
    </div>
  );
}
