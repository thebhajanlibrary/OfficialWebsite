import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { FestivalCelebration } from "@/components/home/FestivalCelebration";
import { isOmittedFromLibrary } from "@/lib/albums";
import { getFolder } from "@/lib/folders";
import { getBhajans, getCategories, getFestivalBhajans } from "@/lib/queries";
import { getCurrentOrUpcomingFestival, getUpcomingFestivals } from "@/lib/festivals";
import type { BhajanWithCategories } from "@/lib/types";

/** Featured folders swap every six hours, and stay put if you refresh in between. */
const HERO_FOLDERS: { slug: string; note: string; image?: string }[] = [
  {
    slug: "hanuman-chalisa",
    note: "Every version",
    image: "/images/hanuman-chalisa-lata-mangeshkar.png",
  },
  { slug: "chutney-style-bhajan", note: "Baithak devotionals" },
  { slug: "aarti", note: "Satsang aartis" },
  { slug: "wedding", note: "Marriage songs" },
  { slug: "holi", note: "Songs for Phagwah" },
  { slug: "om-jai-jagdish-hare", note: "Vishnu aarti" },
  { slug: "om-jai-lakshmi-mata", note: "Lakshmi aarti" },
  { slug: "o-palanhare", note: "The Lagaan prayer" },
  { slug: "birthday-songs", note: "Long life and blessings" },
  { slug: "garba", note: "Navratri garba" },
];

const HERO_SLOT_MS = 6 * 60 * 60 * 1000;

function featuredFolders(count = 4) {
  const pool = HERO_FOLDERS.flatMap((entry) => {
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
  if (pool.length === 0) return [];
  const start = Math.floor(Date.now() / HERO_SLOT_MS) % pool.length;
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) => {
    return pool[(start + i) % pool.length]!;
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
    recent = all.filter((b) => !isOmittedFromLibrary(b.slug)).slice(0, 8);
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

  const recordings = featuredFolders();

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
    { href: "/chutney", label: "Traditional Chutney", hint: "Indo-Caribbean classics" },
    { href: "/folders/chutney-style-bhajan", label: "Chutney Bhajan", hint: "Baithak devotionals" },
    { href: "/chowtal", label: "Chowtal", hint: "Phagwah singing" },
    { href: "/folders/wedding", label: "Wedding Songs", hint: "Marriage and blessings" },
    { href: "/folders/hanuman-chalisa", label: "Hanuman Chalisa", hint: "Every version" },
    { href: "/browse/occasion/birthday", label: "Birthday Songs", hint: "Long life and blessings" },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="grid items-center gap-10 pt-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pt-6">
        <div>
          <h1>
            <img
              src="/brand/logo.svg"
              alt="Bhajan Library"
              width={640}
              height={128}
              className="h-16 w-auto max-w-full sm:h-24"
            />
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Lyrics and recordings, kept by deity, occasion, and singer.
          </p>
          <div className="relative z-30 mt-8 max-w-xl">
            <SearchBar large />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {recordings.map((item) => (
            <Link key={item.href} href={item.href} className="group min-w-0">
              <span className="relative block aspect-square overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_40px_rgba(19,32,51,0.12)]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="240px"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-2.5 block truncate font-display text-lg font-semibold text-primary group-hover:text-accent">
                {item.title}
              </span>
              <span className="block truncate text-sm text-muted">{item.note}</span>
            </Link>
          ))}
        </div>
      </section>

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
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            The shelves
          </h2>
          <p className="hidden text-sm text-muted sm:block">Twelve ways in.</p>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {browse.map((item, index) => (
            <li key={item.href} className="bg-surface">
              <Link
                href={item.href}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-2 px-5 py-4 transition hover:bg-accent-soft sm:px-6"
              >
                <span className="font-display text-lg text-accent">
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
