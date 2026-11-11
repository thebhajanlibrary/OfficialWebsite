import type { Metadata } from "next";
import Link from "next/link";
import { RelatedCollections } from "@/components/layout/RelatedCollections";
import { getChowtalGrouped, getChowtalSorted } from "@/lib/chowtal";

export const metadata: Metadata = {
  title: "Chowtal",
  description:
    "Phagwah / Holi chowtal lyrics for singing — organised by type, no audio needed.",
};

export default function ChowtalIndexPage() {
  const groups = getChowtalGrouped();
  const total = getChowtalSorted().length;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm text-muted">
          <Link href="/browse/occasion/holi" className="transition hover:text-primary">
            Holi / Phagwah
          </Link>
        </p>
        <h1 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
          Chowtal
        </h1>
        <p className="max-w-2xl text-muted">
          Lyrics for in-person Phagwah singing — {total} pieces, grouped by type.
          Ordered roughly from common session openers and Holi favourites toward
          less-used forms. Meaning sits under the whole song (not line by line).
          No audio; use singing mode when you need bigger type.
        </p>
      </header>

      <RelatedCollections
        items={[
          {
            href: "/albums/sweet-phagwah-songs-and-chowtal",
            title: "Sweet Phagwah Songs and Chowtal",
            kicker: "Album · audio",
            hint: "Mohabeer MO-191 (1998) — Pt. Chunelall & Jharna · MG Satsang Society",
            cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
          },
          {
            href: "/albums/lets-play-holi",
            title: "Let's Play Holi",
            kicker: "Album",
            hint: "VP Premier · Holi remixes — kept as its own album",
            cover_url: "/images/albums/lets-play-holi.png",
          },
          {
            href: "/folders/holi",
            title: "Holi",
            kicker: "Folder",
            hint: "Holi / Phagwah bhajans — separate from this chowtal list",
            cover_url: "/images/albums/lets-play-holi.png",
          },
        ]}
      />

      <nav
        aria-label="Jump to type"
        className="flex flex-wrap gap-2 border-b border-border pb-6"
      >
        {groups.map((g) => (
          <a
            key={g.kind}
            href={`#${g.kind}`}
            className="border border-border bg-surface px-3 py-1.5 text-sm transition hover:border-accent hover:bg-accent-soft"
          >
            {g.label}
            <span className="ml-1.5 text-muted">({g.songs.length})</span>
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.kind} id={g.kind} className="scroll-mt-28 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-primary">
              {g.label}
            </h2>
            <ul className="divide-y divide-border border-y border-border">
              {g.songs.map((song) => (
                <li key={song.slug}>
                  <Link
                    href={`/chowtal/${song.slug}`}
                    className="flex flex-col gap-0.5 py-3.5 transition hover:bg-surface-muted/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-2"
                  >
                    <span className="font-medium text-primary">{song.title}</span>
                    {song.cue && (
                      <span className="shrink-0 text-sm text-muted">{song.cue}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
