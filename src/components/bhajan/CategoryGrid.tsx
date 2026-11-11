import Link from "next/link";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  basePath: string;
  emptyMessage?: string;
};

export function CategoryGrid({
  categories,
  basePath,
  emptyMessage = "No categories yet.",
}: Props) {
  if (categories.length === 0) {
    return (
      <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:grid-cols-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/${cat.slug}`}
          className="group bg-surface px-5 py-6 text-left transition hover:bg-accent-soft"
        >
          <span className="font-display text-xl font-semibold text-primary transition group-hover:text-accent sm:text-2xl">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
