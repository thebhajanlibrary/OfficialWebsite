import type { Metadata } from "next";
import { CategoryGrid } from "@/components/bhajan/CategoryGrid";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Browse by Type" };

export default async function BrowseTypePage() {
  const categories = await getCategories("bhajan_type");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Browse by Type
        </h1>
        <p className="mt-1 text-muted">
          Bhajan, prarthana, aarti, chalisa, mantra, kirtan.
        </p>
      </div>
      <CategoryGrid categories={categories} basePath="/browse/type" />
    </div>
  );
}
