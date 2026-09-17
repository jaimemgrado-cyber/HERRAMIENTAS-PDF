import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import PageSelectionTool from "@/components/tools/PageSelectionTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("delete-pages")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <PageSelectionTool mode="delete" />
    </ToolPageShell>
  );
}
