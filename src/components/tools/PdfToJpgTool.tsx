"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import UsageStatus from "@/components/UsageStatus";
import { pdfToJpgZip } from "@/lib/pdf/pdfToImage";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { useUsageLimit } from "@/lib/useUsageLimit";

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const usage = useUsageLimit();

  const maxSizeMB = PLAN_LIMITS.free.maxFileSizeMB;

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    setResult(null);
    const validation = await validatePdfFile(f, maxSizeMB);
    if (!validation.valid) {
      setError(validation.error ?? "Archivo no válido.");
      return;
    }
    setFile(f);
  };

  const handleConvert = async () => {
    if (processing) return;
    if (!file) return;

    if (!usage.checkCanProceed()) {
      setError(
        `Has alcanzado tus ${usage.limit} operaciones gratuitas de hoy. Puedes volver mañana o actualizar a PDF Pro.`
      );
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const blob = await pdfToJpgZip(file);
      setResult(blob);
      usage.consume();
    } catch (err) {
      setError(friendlyErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const isBlocked = usage.hydrated && usage.isLimitReached;

  return (
    <div>
      {!file && <UploadZone accept="application/pdf" onFiles={handleFile} />}

      {file && !result && (
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{file.name}</span>
          </p>

          {!isBlocked && (
            <button
              type="button"
              onClick={handleConvert}
              disabled={processing}
              className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
            >
              Convertir a JPG
            </button>
          )}

          <UsageStatus
            hydrated={usage.hydrated}
            used={usage.used}
            remaining={usage.remaining}
            limit={usage.limit}
            isLimitReached={usage.isLimitReached}
          />
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      {processing && <ProgressBar label="Generando las imágenes..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tus imágenes están listas</p>
          <p className="mt-1 text-sm text-ink-soft">Se han empaquetado en un archivo ZIP.</p>
          <div className="mt-4">
            <DownloadButton blob={result} filename="paginas.zip" label="Descargar ZIP" />
          </div>
        </div>
      )}
    </div>
  );
}
