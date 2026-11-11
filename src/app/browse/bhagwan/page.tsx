import type { Metadata } from "next";
import { CategoryGrid } from "@/components/bhajan/CategoryGrid";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Browse by Bhagwan" };

export default async function BrowseBhagwanPage() {
  const categories = await getCategories("bhagwan");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Browse by Bhagwan
        </h1>
        <p className="mt-1 text-muted">
          Bhajans appear under every deity you assign.
        </p>
      </div>
      <CategoryGrid categories={categories} basePath="/browse/bhagwan" />
    </div>
  );
}
