export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-lg border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm text-accent"
    >
      {message}
    </div>
  );
}
