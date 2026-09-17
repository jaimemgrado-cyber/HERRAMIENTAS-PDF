import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import MergeTool from "@/components/tools/MergeTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("merge-pdf")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <MergeTool />
    </ToolPageShell>
  );
}
