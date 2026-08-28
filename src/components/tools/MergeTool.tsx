"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import FileList from "@/components/FileList";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import UsageStatus from "@/components/UsageStatus";
import { mergePdfs } from "@/lib/pdf/merge";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { useUsageLimit } from "@/lib/useUsageLimit";

export default function MergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const usage = useUsageLimit();

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
    // Guarda contra doble clic / doble ejecución: si ya hay un
    // procesamiento en curso, ignoramos por completo la llamada.
    if (processing) return;

    if (files.length < 2) {
      setError("Selecciona al menos dos archivos PDF para unir.");
      return;
    }

    if (!usage.checkCanProceed()) {
      setError(
        `Has alcanzado tus ${usage.limit} operaciones gratuitas de hoy. Puedes volver mañana o actualizar a PDF Pro.`
      );
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const blob = await mergePdfs(files);
      setResult(blob);
      usage.consume();
    } catch (err) {
      setError(friendlyErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const showAction = files.length >= 2 && !result;
  const isBlocked = usage.hydrated && usage.isLimitReached;

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

      {showAction && !isBlocked && (
        <button
          type="button"
          onClick={handleMerge}
          disabled={processing}
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
        >
          Unir PDF
        </button>
      )}

      {showAction && (
        <UsageStatus
          hydrated={usage.hydrated}
          used={usage.used}
          remaining={usage.remaining}
          limit={usage.limit}
          isLimitReached={usage.isLimitReached}
        />
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
