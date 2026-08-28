import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools-config";

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col rounded-xl2 border border-line bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5 hover:border-accent/40"
    >
      <span className="text-sm font-semibold text-ink group-hover:text-accent">{tool.name}</span>
      <p className="mt-1 text-sm text-ink-soft">{tool.shortDescription}</p>
    </Link>
  );
}
