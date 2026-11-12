import { pageMeta } from "@/lib/seo";
import { CategoryGrid } from "@/components/bhajan/CategoryGrid";
import { getCategories } from "@/lib/queries";

export const metadata = pageMeta({
  title: "Browse by Occasion",
  description:
    "Bhajans for satsang, Diwali, Holi, Navratri, weddings, birthdays, and the rest of the year.",
  path: "/browse/occasion",
});

export default async function BrowseOccasionPage() {
  const categories = await getCategories("occasion");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Browse by Occasion
        </h1>
        <p className="mt-1 text-muted">
          Festivals, prayers, weddings, memorials, and more.
        </p>
      </div>
      <CategoryGrid categories={categories} basePath="/browse/occasion" />
    </div>
  );
}
