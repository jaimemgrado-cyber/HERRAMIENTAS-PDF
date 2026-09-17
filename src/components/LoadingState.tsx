export default function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label}
    </div>
  );
}
