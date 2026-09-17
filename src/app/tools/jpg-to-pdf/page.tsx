import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("jpg-to-pdf")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <ImageToPdfTool type="jpg" />
    </ToolPageShell>
  );
}
