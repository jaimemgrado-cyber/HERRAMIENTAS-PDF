import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools-config";

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-[10px] font-bold tracking-wide text-accent" aria-hidden>PDF</span>
        <span className="text-lg text-ink-soft transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </div>
      <span className="mt-5 text-base font-semibold text-ink group-hover:text-accent">{tool.name}</span>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-ink-soft">{tool.shortDescription}</p>
      <span className="mt-4 text-xs font-semibold text-ink">Abrir herramienta →</span>
    </Link>
  );
}
