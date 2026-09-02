"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import UsageStatus from "@/components/UsageStatus";
import { rotatePdf, type RotationAngle } from "@/lib/pdf/rotate";
import { parsePageRanges } from "@/lib/pageRanges";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { useUsageLimit } from "@/lib/useUsageLimit";
import { LOGIN_REQUIRED_MESSAGE, limitReachedMessage } from "@/lib/usage-limit";

const ANGLES: RotationAngle[] = [90, 180, 270];

export default function RotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [angle, setAngle] = useState<RotationAngle>(90);
  const [applyToAll, setApplyToAll] = useState(true);
  const [pagesInput, setPagesInput] = useState("");
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
    const bytes = await f.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    setTotalPages(pdf.getPageCount());
    setFile(f);
  };

  const handleRotate = async () => {
    if (processing) return;
    if (!file) return;

    // Validamos la selección de páginas ANTES de consumir la operación,
    // para no gastar cuota si el usuario ha escrito un rango vacío/inválido.
    const pages = applyToAll ? undefined : parsePageRanges(pagesInput, totalPages ?? undefined);
    if (!applyToAll && (!pages || pages.length === 0)) {
      setError("Indica al menos una página válida.");
      return;
    }

    setProcessing(true);
    setError(null);

    const usageResult = await usage.consume();
    if (!usageResult.allowed) {
      setError(usageResult.authenticated ? limitReachedMessage(usageResult.limit) : LOGIN_REQUIRED_MESSAGE);
      setProcessing(false);
      return;
    }

    try {
      const blob = await rotatePdf(file, angle, pages);
      setResult(blob);
    } catch (err) {
      setError(friendlyErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const isBlocked = usage.hydrated && (!usage.authenticated || usage.isLimitReached);

  return (
    <div>
      {!file && <UploadZone accept="application/pdf" onFiles={handleFile} />}

      {file && !result && (
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{file.name}</span> · {totalPages} páginas
          </p>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-ink">Ángulo de rotación</legend>
            <div className="mt-2 flex gap-2">
              {ANGLES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAngle(a)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    angle === a
                      ? "border-accent bg-accent-soft/40 text-accent"
                      : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                checked={applyToAll}
                onChange={() => setApplyToAll(true)}
              />
              Rotar todas las páginas
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                checked={!applyToAll}
                onChange={() => setApplyToAll(false)}
              />
              Rotar solo estas páginas
            </label>
            {!applyToAll && (
              <input
                type="text"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="Ej. 1, 3, 5-7"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
              />
            )}
          </div>

          {!isBlocked && (
            <button
              type="button"
              onClick={handleRotate}
              disabled={processing}
              className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
            >
              Rotar PDF
            </button>
          )}

          <UsageStatus
          plan={usage.plan}
            hydrated={usage.hydrated}
            authenticated={usage.authenticated}
            used={usage.used}
            remaining={usage.remaining}
            limit={usage.limit}
            isLimitReached={usage.isLimitReached}
          />
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      {processing && <ProgressBar label="Rotando tu PDF..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tu PDF está listo</p>
          <div className="mt-4">
            <DownloadButton blob={result} filename="documento-rotado.pdf" />
          </div>
        </div>
      )}
    </div>
  );
}
