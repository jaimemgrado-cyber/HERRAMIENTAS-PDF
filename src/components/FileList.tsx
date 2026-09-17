"use client";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onMove?: (index: number, direction: -1 | 1) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onRemove, onMove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
      {files.map((file, index) => (
        <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-ink-soft">{formatSize(file.size)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onMove && (
              <>
                <button
                  type="button"
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                  aria-label={`Mover ${file.name} hacia arriba`}
                  className="rounded-md px-2 py-1 text-sm text-ink-soft hover:bg-paper disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(index, 1)}
                  disabled={index === files.length - 1}
                  aria-label={`Mover ${file.name} hacia abajo`}
                  className="rounded-md px-2 py-1 text-sm text-ink-soft hover:bg-paper disabled:opacity-30"
                >
                  ↓
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Eliminar ${file.name}`}
              className="rounded-md px-2 py-1 text-sm text-accent hover:bg-accent-soft/40"
            >
              Quitar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
