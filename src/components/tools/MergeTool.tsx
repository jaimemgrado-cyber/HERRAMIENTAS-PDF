"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import FileList from "@/components/FileList";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import { mergePdfs } from "@/lib/pdf/merge";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const maxSizeMB = PLAN_LIMITS.free.maxFileSizeMB;

  const addFiles = async (newFiles: File[]) => {
    setError(null);
    setResult(null);
    for (const file of newFiles) {
      const validation = await validatePdfFile(file, maxSizeMB);
      if (!validation.valid) {
        setError(validation.error ?? "Archivo no válido.");
        return;
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target] as File, next[index] as File];
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Selecciona al menos dos archivos PDF para unir.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const blob = await mergePdfs(files);
      setResult(blob);
    } catch (err) {
      setError(friendlyErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <UploadZone
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        label="Arrastra tus PDF aquí"
        hint="o selecciona varios archivos (mínimo 2)"
      />

      <FileList files={files} onRemove={removeFile} onMove={moveFile} />

      {error && <ErrorMessage message={error} />}

      {files.length >= 2 && !result && (
        <button
          type="button"
          onClick={handleMerge}
          disabled={processing}
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
        >
          Unir PDF
        </button>
      )}

      {processing && <ProgressBar label="Uniendo tus archivos..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tu PDF está listo</p>
          <div className="mt-4">
            <DownloadButton blob={result} filename="documento-unido.pdf" />
          </div>
        </div>
      )}
    </div>
  );
}
