import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import RotateTool from "@/components/tools/RotateTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("rotate-pdf")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <RotateTool />
    </ToolPageShell>
  );
}
