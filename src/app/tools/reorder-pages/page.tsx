import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import SortTool from "@/components/tools/SortTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("reorder-pages")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <SortTool />
    </ToolPageShell>
  );
}
