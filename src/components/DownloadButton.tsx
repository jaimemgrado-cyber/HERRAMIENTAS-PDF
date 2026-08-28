"use client";

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  label?: string;
}

export default function DownloadButton({ blob, filename, label = "Descargar PDF" }: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center rounded-full bg-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-success/90"
    >
      {label}
    </button>
  );
}
