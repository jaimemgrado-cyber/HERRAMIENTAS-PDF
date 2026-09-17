import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import PdfToJpgTool from "@/components/tools/PdfToJpgTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-to-jpg")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <PdfToJpgTool />
    </ToolPageShell>
  );
}
