import type { Category, CategoryType } from "@/lib/types";

/** Seed catalogue for offline / when Supabase is unreachable */
const LOCAL_CATEGORY_DEFS: { name: string; slug: string; type: CategoryType }[] =
  [
    // Bhagwan
    { name: "Ganesh", slug: "ganesh", type: "bhagwan" },
    { name: "Ram", slug: "ram", type: "bhagwan" },
    { name: "Sita", slug: "sita", type: "bhagwan" },
    { name: "Hanuman", slug: "hanuman", type: "bhagwan" },
    { name: "Krishna", slug: "krishna", type: "bhagwan" },
    { name: "Radha", slug: "radha", type: "bhagwan" },
    { name: "Shiva", slug: "shiva", type: "bhagwan" },
    { name: "Durga", slug: "durga", type: "bhagwan" },
    { name: "Lakshmi", slug: "lakshmi", type: "bhagwan" },
    { name: "Saraswati", slug: "saraswati", type: "bhagwan" },
    { name: "Vishnu", slug: "vishnu", type: "bhagwan" },
    { name: "Kali", slug: "kali", type: "bhagwan" },
    { name: "Guru", slug: "guru", type: "bhagwan" },
    { name: "General", slug: "general", type: "bhagwan" },
    // Occasion
    { name: "Birthday", slug: "birthday", type: "occasion" },
    { name: "Wedding", slug: "wedding", type: "occasion" },
    { name: "Funeral", slug: "funeral", type: "occasion" },
    { name: "Memorial", slug: "memorial", type: "occasion" },
    { name: "Diwali", slug: "diwali", type: "occasion" },
    { name: "Holi", slug: "holi", type: "occasion" },
    { name: "Raksha Bandhan", slug: "raksha-bandhan", type: "occasion" },
    { name: "Navratri", slug: "navratri", type: "occasion" },
    { name: "Ram Navami", slug: "ram-navami", type: "occasion" },
    { name: "Janmashtami", slug: "janmashtami", type: "occasion" },
    { name: "Shivratri", slug: "shivratri", type: "occasion" },
    { name: "Hanuman Jayanti", slug: "hanuman-jayanti", type: "occasion" },
    { name: "Jhandi", slug: "jhandi", type: "occasion" },
    { name: "Satsang", slug: "satsang", type: "occasion" },
    { name: "Morning Prayer", slug: "morning-prayer", type: "occasion" },
    { name: "Evening Prayer", slug: "evening-prayer", type: "occasion" },
    // Bhajan type
    { name: "Bhajan", slug: "bhajan", type: "bhajan_type" },
    { name: "Prarthana", slug: "prarthana", type: "bhajan_type" },
    { name: "Aarti", slug: "aarti", type: "bhajan_type" },
    { name: "Chalisa", slug: "chalisa", type: "bhajan_type" },
    { name: "Mantra", slug: "mantra", type: "bhajan_type" },
    { name: "Kirtan", slug: "kirtan", type: "bhajan_type" },
    // Theme
    { name: "Devotion", slug: "devotion", type: "theme" },
    { name: "Surrender", slug: "surrender", type: "theme" },
    { name: "Gratitude", slug: "gratitude", type: "theme" },
    { name: "Peace", slug: "peace", type: "theme" },
    { name: "Wisdom", slug: "wisdom", type: "theme" },
    { name: "Protection", slug: "protection", type: "theme" },
    // Language
    { name: "Hindi", slug: "hindi", type: "language" },
    { name: "Sanskrit", slug: "sanskrit", type: "language" },
    { name: "Gujarati", slug: "gujarati", type: "language" },
    { name: "English", slug: "english", type: "language" },
    // Suitability
    { name: "Funeral-specific", slug: "funeral-specific", type: "suitability" },
    {
      name: "Suitable for funerals",
      slug: "suitable-for-funerals",
      type: "suitability",
    },
    {
      name: "Not generally used at funerals",
      slug: "not-generally-used-at-funerals",
      type: "suitability",
    },
  ];

const EPOCH = "1970-01-01T00:00:00.000Z";

export const LOCAL_CATEGORIES: Category[] = LOCAL_CATEGORY_DEFS.map((c) => ({
  id: `local-${c.type}-${c.slug}`,
  name: c.name,
  slug: c.slug,
  type: c.type,
  created_at: EPOCH,
}));

export function getLocalCategories(type?: CategoryType): Category[] {
  const list = type
    ? LOCAL_CATEGORIES.filter((c) => c.type === type)
    : LOCAL_CATEGORIES;
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocalCategoryBySlug(
  type: CategoryType,
  slug: string
): Category | null {
  return (
    LOCAL_CATEGORIES.find((c) => c.type === type && c.slug === slug) ?? null
  );
}
