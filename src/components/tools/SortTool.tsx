"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import UploadZone from "@/components/UploadZone";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ErrorMessage from "@/components/ErrorMessage";
import { sortPages } from "@/lib/pdf/sortPages";
import { validatePdfFile, friendlyErrorMessage } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export default function SortTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [orderInput, setOrderInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

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
    setOrderInput(Array.from({ length: pdf.getPageCount() }, (_, i) => i + 1).join(", "));
    setFile(f);
  };

  const handleSort = async () => {
    if (!file || !totalPages) return;
    const order = orderInput
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => Number.isFinite(n));

    if (order.length !== totalPages || new Set(order).size !== totalPages) {
      setError(`Debes indicar exactamente las ${totalPages} páginas, una sola vez cada una.`);
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const blob = await sortPages(file, order);
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
          <label htmlFor="order" className="mt-4 block text-sm font-medium text-ink">
            Nuevo orden de páginas
          </label>
          <input
            id="order"
            type="text"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Escribe el número de cada página en el orden en que quieres que aparezca, separado por
            comas.
          </p>

          <button
            type="button"
            onClick={handleSort}
            disabled={processing}
            className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-50"
          >
            Guardar orden
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      {processing && <ProgressBar label="Reordenando tu PDF..." />}

      {result && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6 text-center">
          <p className="font-medium text-ink">Tu PDF está listo</p>
          <div className="mt-4">
            <DownloadButton blob={result} filename="documento-reordenado.pdf" />
          </div>
        </div>
      )}
    </div>
  );
}
