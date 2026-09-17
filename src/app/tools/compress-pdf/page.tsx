import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import CompressTool from "@/components/tools/CompressTool";
import { getToolBySlug } from "@/lib/tools-config";

const tool = getToolBySlug("compress-pdf")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <CompressTool />
    </ToolPageShell>
  );
}
