import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import SplitTool from "@/components/tools/SplitTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("split-pdf")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <SplitTool />
    </ToolPageShell>
  );
}
