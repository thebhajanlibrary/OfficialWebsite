import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { FestivalCelebration } from "@/components/home/FestivalCelebration";
import { getBhajans, getCategories, getFestivalBhajans } from "@/lib/queries";
import { getCurrentOrUpcomingFestival, getUpcomingFestivals } from "@/lib/festivals";
import type { BhajanWithCategories } from "@/lib/types";
import { BrandMark } from "@/components/layout/BrandMark";

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
    recent = all.slice(0, 8);
    bhagwanCount = bhagwan.length;
    // Only show setup banner when there is truly no local catalogue either
    setupNeeded = all.length === 0;

    // Load featured bhajans for current and upcoming festivals
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

  const browse = [
    { href: "/bhajans", label: "All Bhajans", hint: "Full catalogue" },
    {
      href: "/chowtal",
      label: "Chowtal",
      hint: "Phagwah singing",
    },
    {
      href: "/chutney",
      label: "Traditional Chutney",
      hint: "Indo-Caribbean classics",
    },
    {
      href: "/folders/chutney-style-bhajan",
      label: "Chutney Bhajan",
      hint: "Baithak devotionals",
    },
    {
      href: "/folders/wedding",
      label: "Wedding Songs",
      hint: "Marriage & wedding",
    },
    {
      href: "/folders/hanuman-chalisa",
      label: "Hanuman Chalisa",
      hint: "Every version",
    },
    {
      href: "/albums/shree-hanuman-chalisa-hariharan",
      label: "Shree Hanuman Chalisa",
      hint: "Hariharan · 1993",
    },
    {
      href: "/albums/lets-play-holi",
      label: "Let's Play Holi",
      hint: "Holi remixes",
    },
    {
      href: "/albums/yaad-sangeet-harry-panday",
      label: "Yaad Sangeet",
      hint: "Harry Panday",
    },
    { href: "/artists", label: "Artists", hint: "By singer" },
    {
      href: "/browse/bhagwan",
      label: "By Bhagwan",
      hint: bhagwanCount ? `${bhagwanCount} deities` : "Browse deities",
    },
    {
      href: "/browse/occasion/birthday",
      label: "Birthday Songs",
      hint: "Long life & blessings",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="relative -mx-4 px-4 pb-2 pt-4 sm:-mx-6 sm:px-6 sm:pb-4 sm:pt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 18% 18%, rgba(196,120,26,0.11), transparent 55%), radial-gradient(ellipse 55% 65% at 92% 8%, rgba(19,32,51,0.08), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-rise flex flex-col items-center">
            <BrandMark className="mb-5 h-16 w-16 sm:h-20 sm:w-20" />
            <p className="font-display text-5xl font-semibold leading-[1.05] text-primary sm:text-6xl md:text-7xl">
              Bhajan Library
            </p>
          </div>
          <p className="animate-rise-delay mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
            Find bhajans for satsang by deity, occasion, or lyric.
          </p>
          <div className="animate-rise-delay relative z-30 mx-auto mt-8 max-w-2xl text-left">
            <SearchBar large autofocus />
          </div>
        </div>
      </section>

      {/* Religious Festival Celebration & Featured Songs */}
      {(currentFestivalInfo || upcomingFestivals.length > 0) && (
        <FestivalCelebration
          currentFestivalInfo={currentFestivalInfo}
          upcomingFestivals={upcomingFestivals}
          festivalsBhajansMap={festivalsBhajansMap}
        />
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

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-3xl font-semibold text-primary">
            Browse
          </h2>
          <p className="mt-1 text-muted">Explore the library by collection.</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {browse.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-surface px-5 py-6 transition hover:bg-accent-soft"
            >
              <p className="font-display text-xl font-semibold text-primary transition group-hover:text-accent">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-muted">{item.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold text-primary">
                In the library
              </h2>
              <p className="mt-1 text-muted">Recently added.</p>
            </div>
            <Link
              href="/bhajans"
              className="text-sm font-medium text-accent transition hover:underline"
            >
              View all
            </Link>
          </div>
          <BhajanList bhajans={recent} />
        </section>
      )}
    </div>
  );
}
