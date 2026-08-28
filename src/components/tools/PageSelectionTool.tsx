"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import { deletePages } from "@/lib/pdf/deletePages";
import { extractPages } from "@/lib/pdf/extractPages";
import { parsePageRanges } from "@/lib/pageRanges";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export default function PageSelectionTool({ mode }: { mode: "delete" | "extract" }) {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pagesInput, setPagesInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const maxSizeMB = PLAN_LIMITS.free.maxFileSizeMB;
  const actionLabel = mode === "delete" ? "Eliminar páginas" : "Extraer páginas";
  const fieldLabel =
    mode === "delete" ? "Páginas a eliminar" : "Páginas a conservar";

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

  const handleRun = async () => {
    if (!file) return;
    const pages = parsePageRanges(pagesInput, totalPages ?? undefined);
    if (pages.length === 0) {
      setError("Indica al menos una página válida.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const blob =
        mode === "delete" ? await deletePages(file, pages) : await extractPages(file, pages);
      setResult(blob);
    } catch (err) {
      setError(friendlyErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {!file && <UploadZone accept="application/pdf" onFiles={handleFile} />}

      {file && !result && (
        <div className="rounded-xl2 border border-line bg-white p-6">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{file.name}</span> · {totalPages} páginas
          </p>
          <label htmlFor="pages" className="mt-4 block text-sm font-medium text-ink">
            {fieldLabel}
          </label>
          <input
            id="pages"
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="Ej. 1, 3, 5-7"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
          />

          <button
            type="button"
            onClick={handleRun}
            disabled={processing}
            className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
          >
            {actionLabel}
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      {processing && <ProgressBar label="Procesando tu PDF..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tu PDF está listo</p>
          <div className="mt-4">
            <DownloadButton blob={result} filename="documento.pdf" />
          </div>
        </div>
      )}
    </div>
  );
}
