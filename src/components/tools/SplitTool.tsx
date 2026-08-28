"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import UsageStatus from "@/components/UsageStatus";
import { splitPdf, type SplitRange } from "@/lib/pdf/split";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { useUsageLimit } from "@/lib/useUsageLimit";
import { LOGIN_REQUIRED_MESSAGE, limitReachedMessage } from "@/lib/usage-limit";

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("1-1");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ name: string; blob: Blob }[] | null>(null);
  const usage = useUsageLimit();

  const maxSizeMB = PLAN_LIMITS.free.maxFileSizeMB;

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    setResults(null);
    const validation = await validatePdfFile(f, maxSizeMB);
    if (!validation.valid) {
      setError(validation.error ?? "Archivo no válido.");
      return;
    }
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setTotalPages(pdf.getPageCount());
      setRangeInput(`1-${pdf.getPageCount()}`);
      setFile(f);
    } catch {
      setError("Este PDF no ha podido leerse. Comprueba que no esté dañado.");
    }
  };

  const parseRanges = (): SplitRange[] => {
    return rangeInput
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        if (part.includes("-")) {
          const [from, to] = part.split("-").map((n) => parseInt(n.trim(), 10));
          return { from: from ?? 1, to: to ?? from ?? 1 };
        }
        const n = parseInt(part, 10);
        return { from: n, to: n };
      });
  };

  const handleSplit = async () => {
    if (processing) return;
    if (!file) return;

    setProcessing(true);
    setError(null);

    const usageResult = await usage.consume();
    if (!usageResult.allowed) {
      setError(usageResult.authenticated ? limitReachedMessage(usageResult.limit) : LOGIN_REQUIRED_MESSAGE);
      setProcessing(false);
      return;
    }

    try {
      const ranges = parseRanges();
      const out = await splitPdf(file, ranges);
      if (out.length === 0) {
        setError("No se ha generado ningún archivo. Revisa el rango de páginas indicado.");
      } else {
        setResults(out);
      }
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

      {file && totalPages && (
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{file.name}</span> · {totalPages} páginas
          </p>
          <label htmlFor="ranges" className="mt-4 block text-sm font-medium text-ink">
            Rangos de páginas (uno por archivo)
          </label>
          <input
            id="ranges"
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="Ej. 1-3, 4-6, 7-10"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Separa cada rango con una coma. Cada rango generará un archivo PDF independiente.
          </p>

          {!results && !isBlocked && (
            <button
              type="button"
              onClick={handleSplit}
              disabled={processing}
              className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
            >
              Dividir PDF
            </button>
          )}

          {!results && (
            <UsageStatus
              hydrated={usage.hydrated}
              authenticated={usage.authenticated}
              used={usage.used}
              remaining={usage.remaining}
              limit={usage.limit}
              isLimitReached={usage.isLimitReached}
            />
          )}
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      {processing && <ProgressBar label="Dividiendo tu PDF..." />}

      {results && (
        <div className="mt-6 space-y-3">
          <p className="font-medium text-ink">Tus archivos están listos</p>
          {results.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4"
            >
              <span className="text-sm text-ink">{r.name}</span>
              <DownloadButton blob={r.blob} filename={r.name} label="Descargar" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
