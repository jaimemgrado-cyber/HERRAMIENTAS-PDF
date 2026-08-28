import { CATEGORY_LABELS, TOOLS, type ToolCategory } from "@/lib/tools-config";
import ToolCard from "./ToolCard";

export default function ToolGrid({ category }: { category?: ToolCategory }) {
  const categories: ToolCategory[] = category
    ? [category]
    : (Object.keys(CATEGORY_LABELS) as ToolCategory[]);

  return (
    <div className="space-y-10">
      {categories.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat);
        if (tools.length === 0) return null;
        return (
          <div key={cat}>
            <h2 className="font-display text-xl font-semibold text-ink">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
