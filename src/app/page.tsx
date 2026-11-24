import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { RotatingShelf, type ShelfItem } from "@/components/home/RotatingShelf";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { FestivalCelebration } from "@/components/home/FestivalCelebration";
import { isOmittedFromLibrary } from "@/lib/albums";
import { getFolder, isKeptFromAllBhajans } from "@/lib/folders";
import { getBhajans, getCategories, getFestivalBhajans } from "@/lib/queries";
import { getCurrentOrUpcomingFestival, getUpcomingFestivals } from "@/lib/festivals";
import type { BhajanWithCategories } from "@/lib/types";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, websiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";
import { TRADITIONAL_CHUTNEY_ENABLED } from "@/lib/features";

export const metadata = pageMeta({
  title: TRADITIONAL_CHUTNEY_ENABLED
    ? "Bhajan Library — Bhajan and Chutney Lyrics"
    : "Bhajan Library — Bhajan Lyrics and Recordings",
  description: SITE_DESCRIPTION,
  path: "/",
  index: true,
  absolute: true,
});

const HERO_FOLDERS: { slug: string; note: string; image?: string }[] = [
  { slug: "hanuman-chalisa", note: "Every version" },
  { slug: "chutney-style-bhajan", note: "Baithak devotionals" },
  { slug: "aarti", note: "Satsang aartis" },
  { slug: "wedding", note: "Marriage songs" },
  { slug: "holi", note: "Songs for Phagwah" },
  { slug: "birthday-songs", note: "Long life and blessings" },
  { slug: "garba", note: "Navratri garba" },
  { slug: "funeral-memorial", note: "Prayers and remembrance" },
  { slug: "instrumentals-karaoke", note: "Sing along" },
];

function shelfItems(): ShelfItem[] {
  return HERO_FOLDERS.flatMap((entry) => {
    const folder = getFolder(entry.slug);
    const image = entry.image ?? folder?.cover_url;
    if (!folder || !image) return [];
    return [
      {
        href: `/folders/${folder.slug}`,
        title: folder.title,
        note: entry.note,
        image,
      },
    ];
  });
}

export const revalidate = 21600;

export default async function HomePage() {
  let recent: Awaited<ReturnType<typeof getBhajans>> = [];
  let bhagwanCount = 0;
  let setupNeeded = false;
  const currentFestivalInfo = getCurrentOrUpcomingFestival();
  const upcomingFestivals = getUpcomingFestivals(undefined, 5);
  const festivalsBhajansMap: Record<string, BhajanWithCategories[]> = {};

  try {
    const [all, bhagwan] = await Promise.all([
      getBhajans(),
      getCategories("bhagwan").catch(() => [] as Awaited<
        ReturnType<typeof getCategories>
      >),
    ]);
    recent = all
      .filter((b) => !isOmittedFromLibrary(b.slug) && !isKeptFromAllBhajans(b.slug))
      .slice(0, 8);
    bhagwanCount = bhagwan.length;
    setupNeeded = all.length === 0;

    const festivalIds = new Set<string>();
    if (currentFestivalInfo) festivalIds.add(currentFestivalInfo.festival.id);
    for (const u of upcomingFestivals) {
      festivalIds.add(u.festival.id);
    }

    await Promise.all(
      Array.from(festivalIds).map(async (fId) => {
        festivalsBhajansMap[fId] = await getFestivalBhajans(fId);
      })
    );
  } catch {
    setupNeeded = true;
  }

  const recordings = shelfItems();

  const browse = [
    { href: "/bhajans", label: "All Bhajans", hint: "Full catalogue" },
    { href: "/albums", label: "Albums", hint: "Recordings in track order" },
    { href: "/artists", label: "Artists", hint: "Singers and teachers" },
    {
      href: "/browse/bhagwan",
      label: "By Bhagwan",
      hint: bhagwanCount ? `${bhagwanCount} deities` : "Browse by deity",
    },
    { href: "/browse/occasion", label: "Occasions", hint: "Festival, satsang, and home" },
    { href: "/calendar", label: "Hindu Calendar", hint: "The dates for this year" },
    ...(TRADITIONAL_CHUTNEY_ENABLED
      ? [{ href: "/chutney", label: "Traditional Chutney", hint: "Indo-Caribbean classics" }]
      : []),
    { href: "/folders/chutney-style-bhajan", label: "Chutney Bhajan", hint: "Baithak devotionals" },
    { href: "/chowtal", label: "Chowtal", hint: "Phagwah singing" },
    { href: "/folders/wedding", label: "Wedding Songs", hint: "Marriage and blessings" },
    { href: "/folders/hanuman-chalisa", label: "Hanuman Chalisa", hint: "Every version" },
    { href: "/browse/occasion/birthday", label: "Birthday Songs", hint: "Long life and blessings" },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      <JsonLd data={websiteJsonLd()} />
      <section className="max-w-3xl pt-2 lg:pt-4">
        <h1 className="font-display text-5xl font-semibold leading-none text-primary sm:text-6xl">
          Bhajan Library
        </h1>
        <div className="mt-4 h-px w-12 bg-accent" />
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Lyrics and recordings, kept by deity, occasion, and singer.
        </p>
        <div className="relative z-30 mt-8 max-w-xl">
          <SearchBar large />
        </div>
      </section>

      {recordings.length > 0 && (
        <div data-nosnippet>
          <RotatingShelf items={recordings} />
        </div>
      )}

      {(currentFestivalInfo || upcomingFestivals.length > 0) && (
        <div data-nosnippet>
          <FestivalCelebration
            currentFestivalInfo={currentFestivalInfo}
            upcomingFestivals={upcomingFestivals}
            festivalsBhajansMap={festivalsBhajansMap}
          />
        </div>
      )}

      {setupNeeded && (
        <div className="lyric-panel rounded-r-lg px-5 py-4 text-sm">
          <p className="font-medium text-primary">Catalogue note</p>
          <p className="mt-1.5 text-muted">
            No songs loaded yet. If you manage this site, connect Supabase in{" "}
            <code className="rounded bg-surface-muted px-1.5 py-0.5 text-foreground">
              .env.local
            </code>{" "}
            or add local content.
          </p>
        </div>
      )}

      <section className="space-y-5" data-nosnippet>
        <div className="flex items-end gap-4">
          <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            Browse
          </h2>
          <span className="mb-2 hidden h-px flex-1 bg-border sm:block" />
        </div>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {browse.map((item, index) => (
            <li key={item.href} className="bg-surface">
              <Link
                href={item.href}
                className="group flex items-baseline gap-4 px-5 py-3.5 transition hover:bg-accent-soft sm:px-6"
              >
                <span className="w-6 shrink-0 font-display text-sm tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl font-semibold text-primary transition group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{item.hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {recent.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-end gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-primary">
                  In the library
                </h2>
                <p className="mt-1 text-muted">Recently added.</p>
              </div>
              <span className="mb-2 hidden h-px flex-1 bg-border sm:block" />
            </div>
            <Link
              href="/bhajans"
              className="text-sm font-medium text-accent transition hover:underline"
            >
              View all
            </Link>
          </div>
          <div data-nosnippet>
            <BhajanList bhajans={recent} />
          </div>
        </section>
      )}
    </div>
  );
}
