import Image from "next/image";
import Link from "next/link";
import type { BhajanWithCategories } from "@/lib/types";
import { artistSlug, creditedArtistNames } from "@/lib/artists";
import { albumForBhajan, countsTowardArtistIndex } from "@/lib/albums";
import { BhajanAlternateTitle } from "@/components/bhajan/BhajanAlternateTitle";
import {
  isBhajanPartyMixTrack,
  isInstrumentalKaraokeTrack,
} from "@/lib/folders";
import { ShareSongButton } from "@/components/bhajan/ShareSongButton";
import { bhajanPlayHref, type PlayQueueRef } from "@/lib/play-queue";

type Props = {
  bhajan: BhajanWithCategories;
  playQueue?: PlayQueueRef | null;
};

export function BhajanCard({ bhajan, playQueue = null }: Props) {
  const categoryPreview = bhajan.categories
    .slice(0, 4)
    .map((c) => c.name)
    .join(" · ");

  const artistNames = creditedArtistNames(bhajan.artist_version);
  const linkArtist = artistNames.length > 0 && countsTowardArtistIndex(bhajan.slug);
  const isRemix = isBhajanPartyMixTrack(bhajan.slug);
  const isInstrumental = isInstrumentalKaraokeTrack(bhajan.slug);
  const album = albumForBhajan(bhajan.slug);

  const href = bhajanPlayHref(bhajan.slug, playQueue);

  return (
    <div className="group flex items-start justify-between gap-4 border-b border-border/80 px-1 py-4 transition hover:bg-surface/80 sm:px-3">
      {bhajan.thumbnail_url && (
        <Link
          href={href}
          className="relative mt-0.5 aspect-square w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:w-20"
        >
          <Image
            src={bhajan.thumbnail_url}
            alt=""
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={href}
            className="font-display text-xl font-semibold text-primary transition hover:text-accent sm:text-2xl"
          >
            {bhajan.title}
          </Link>
          {isRemix && (
            <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              Remix
            </span>
          )}
          {isInstrumental && (
            <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              Instrumental
            </span>
          )}
        </div>
        {bhajan.alternate_title && (
          <div className="mt-0.5 truncate">
            <BhajanAlternateTitle
              alternateTitle={bhajan.alternate_title}
              album={album}
              className="truncate text-sm text-muted"
            />
          </div>
        )}
        {isRemix && (
          <p className="mt-1 text-xs text-muted">
            Party mix — skipped in All Bhajans Play all ·{" "}
            <Link
              href="/folders/bhajan-party-mix"
              className="text-accent transition hover:underline"
            >
              Bhajan Party Mix
            </Link>
          </p>
        )}
        {isInstrumental && (
          <p className="mt-1 text-xs text-muted">
            Instrumental / karaoke — skipped in All Bhajans Play all ·{" "}
            <Link
              href="/folders/instrumentals-karaoke"
              className="text-accent transition hover:underline"
            >
              Instrumentals &amp; Karaoke
            </Link>
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {artistNames.length > 0 &&
            (linkArtist ? (
              <span className="font-medium text-accent">
                {artistNames.map((name, i) => (
                  <span key={artistSlug(name)}>
                    {i > 0 ? " · " : null}
                    <Link
                      href={`/artists/${artistSlug(name)}`}
                      className="transition hover:underline"
                    >
                      {name}
                    </Link>
                  </span>
                ))}
              </span>
            ) : (
              <span className="font-medium text-accent">
                {artistNames.join(" · ")}
              </span>
            ))}
          {categoryPreview && (
            <span className="text-xs tracking-wide text-accent/90">
              {categoryPreview}
              {bhajan.categories.length > 4 ? "…" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 flex shrink-0 items-center gap-1">
        <ShareSongButton path={`/bhajans/${bhajan.slug}`} title={bhajan.title} />
        <Link
          href={href}
          className="shrink-0 px-1 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-label={`Open ${bhajan.title}`}
        >
          →
        </Link>
      </div>
    </div>
  );
}
