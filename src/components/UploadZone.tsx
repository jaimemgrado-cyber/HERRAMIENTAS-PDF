"use client";

import { useCallback, useId, useRef, useState } from "react";
import clsx from "clsx";

interface UploadZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

/**
 * Zona de subida con drag & drop. Incluye SIEMPRE una alternativa mediante
 * botón real (<input type="file">) para quien no pueda usar drag & drop
 * (teclado, lector de pantalla, motricidad reducida) — ver sección
 * "Accesibilidad" de la spec.
 */
export default function UploadZone({
  accept,
  multiple = false,
  onFiles,
  label = "Arrastra tu PDF aquí",
  hint = "o selecciona un archivo desde tu dispositivo",
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    },
    [onFiles]
  );

  return (
    <div
      className={clsx(
        "rounded-xl2 border-2 border-dashed p-10 text-center transition-colors",
        isDragging ? "border-accent bg-accent-soft/40" : "border-line bg-white"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <p className="font-display text-lg font-semibold text-ink">{label}</p>
      <p className="mt-1 text-sm text-ink-soft">{hint}</p>

      <label
        htmlFor={inputId}
        className="mt-5 inline-flex cursor-pointer items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
      >
        Seleccionar archivo
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-4 text-xs text-ink-soft">
        Tus archivos se procesan en tu navegador y no se suben a ningún servidor.
      </p>
    </div>
  );
}
