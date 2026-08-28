"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import UsageStatus from "@/components/UsageStatus";
import { compressPdf, type CompressionLevel } from "@/lib/pdf/compress";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { useUsageLimit } from "@/lib/useUsageLimit";

const LEVELS: { id: CompressionLevel; label: string }[] = [
  { id: "low", label: "Ligera" },
  { id: "medium", label: "Media" },
  { id: "high", label: "Máxima" },
];

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number } | null>(null);
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

  const handleCompress = async () => {
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
      const blob = await compressPdf(file, level);
      setResult({ blob, originalSize: file.size });
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
            <span className="font-medium text-ink">{file.name}</span> ·{" "}
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-ink">Nivel de compresión</legend>
            <div className="mt-2 flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLevel(l.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    level === l.id
                      ? "border-accent bg-accent-soft/40 text-accent"
                      : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </fieldset>

          {!isBlocked && (
            <button
              type="button"
              onClick={handleCompress}
              disabled={processing}
              className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
            >
              Comprimir PDF
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
      {processing && <ProgressBar label="Comprimiendo tu PDF..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tu PDF está listo</p>
          <p className="mt-1 text-sm text-ink-soft">
            {(result.originalSize / (1024 * 1024)).toFixed(1)} MB →{" "}
            {(result.blob.size / (1024 * 1024)).toFixed(1)} MB
          </p>
          <div className="mt-4">
            <DownloadButton blob={result.blob} filename="documento-comprimido.pdf" />
          </div>
        </div>
      )}
    </div>
  );
}
