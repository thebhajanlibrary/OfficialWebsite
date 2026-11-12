import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BhajanAlternateTitle } from "@/components/bhajan/BhajanAlternateTitle";
import { LyricsView } from "@/components/bhajan/LyricsView";
import { CompanionVideo } from "@/components/bhajan/CompanionVideo";
import { QueueAwarePlayer } from "@/components/bhajan/QueueAwarePlayer";
import {
  getAdjacentBhajans,
  getCurrentUser,
  neighborsInQueue,
  resolvePlayQueueSlugs,
  resolvePlayQueueTracks,
} from "@/lib/queries";
import {
  formatDate,
  isLocalAudioUrl,
  isLocalVideoUrl,
  youtubeEmbedUrl,
} from "@/lib/utils";
import { artistSlug, creditedArtistNames } from "@/lib/artists";
import {
  albumForBhajan,
  countsTowardArtistIndex,
  trackNumberInAlbum,
} from "@/lib/albums";
import { folderForBhajan } from "@/lib/folders";
import { lyricsNeedPermission } from "@/lib/lyrics-rights";
import { AutoplayLink } from "@/components/bhajan/AutoplayLink";
import {
  bhajanPlayHref,
  encodePlayQueue,
  playQueueLabel,
  queueFromSearch,
} from "@/lib/play-queue";
import { CATEGORY_TYPE_LABELS, type CategoryType } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = await getAdjacentBhajans(slug);
  return { title: current?.title ?? "Bhajan" };
}

export default async function BhajanDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const { current, prev, next } = await getAdjacentBhajans(slug);
  if (!current) notFound();

  const queue = queueFromSearch(sp);
  const queueSlugs = queue ? await resolvePlayQueueSlugs(queue) : [];
  const queueTracks = queue ? await resolvePlayQueueTracks(queue) : [];
  const queueKey = queue ? encodePlayQueue(queue) : null;
  const queueNeighbors = queue
    ? neighborsInQueue(queueSlugs, current.slug)
    : null;
  const autoPlay = sp.autoplay === "1" || sp.play === "1";
  const nextInQueue =
    queue && queueNeighbors?.nextSlug
      ? bhajanPlayHref(queueNeighbors.nextSlug, queue, { autoplay: true })
      : null;
  const prevInQueue =
    queue && queueNeighbors?.prevSlug
      ? bhajanPlayHref(queueNeighbors.prevSlug, queue, { autoplay: true })
      : null;
  const queueNote = queue ? playQueueLabel(queue) : null;

  const user = await getCurrentUser();
  const embedFromAudio = youtubeEmbedUrl(current.audio_url);
  const localVideo = isLocalVideoUrl(current.audio_url);
  const localAudio = isLocalAudioUrl(current.audio_url);
  const videoOnly = /^\[Video only/i.test(current.roman_lyrics.trim());
  const albumTrack = /^\[Album track/i.test(current.roman_lyrics.trim());
  const hideLyrics = videoOnly || albumTrack;
  const hasLyrics =
    !hideLyrics && current.roman_lyrics.trim().length > 0;
  const lyricsPermission = !hasLyrics && lyricsNeedPermission(current.slug);
  const hymnFolder = folderForBhajan(current);
  const album = albumForBhajan(current.slug);
  const albumTrackNo = album
    ? trackNumberInAlbum(album, current.slug)
    : null;
  // Poster for click-to-play (YouTube needs a user gesture; bare autoplay often fails)
  const playerCover =
    current.cover_url ?? current.thumbnail_url ?? null;
  const youtubeExtra = youtubeEmbedUrl(current.youtube_url);
  // youtube_url-only tracks (e.g. Gauri Puja) still get an in-page player
  const embed =
    embedFromAudio ??
    (!localVideo && !localAudio ? youtubeExtra : null);
  const artistNames = creditedArtistNames(current.artist_version);
  const linkArtist =
    artistNames.length > 0 && countsTowardArtistIndex(current.slug);

  const byType = current.categories.reduce(
    (acc, cat) => {
      (acc[cat.type] ??= []).push(cat);
      return acc;
    },
    {} as Record<string, typeof current.categories>
  );

  const navPrev = prevInQueue
    ? { href: prevInQueue, title: "Previous in queue" }
    : prev
      ? { href: `/bhajans/${prev.slug}`, title: prev.title }
      : null;
  const navNext = nextInQueue
    ? { href: nextInQueue, title: "Next in queue" }
    : next
      ? { href: `/bhajans/${next.slug}`, title: next.title }
      : null;

  // Resolve titles for queue neighbors when possible
  let navPrevTitle = navPrev?.title ?? "";
  let navNextTitle = navNext?.title ?? "";
  if (queueNeighbors?.prevSlug) {
    const p = await getAdjacentBhajans(queueNeighbors.prevSlug);
    if (p.current) navPrevTitle = p.current.title;
  }
  if (queueNeighbors?.nextSlug) {
    const n = await getAdjacentBhajans(queueNeighbors.nextSlug);
    if (n.current) navNextTitle = n.current.title;
  }

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm text-muted">
          <Link href="/bhajans" className="transition hover:text-primary">
            All Bhajans
          </Link>
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
          {current.title}
        </h1>
        {current.alternate_title && (
          <BhajanAlternateTitle
            alternateTitle={current.alternate_title}
            album={album}
          />
        )}
        {artistNames.length > 0 && (
          <p className="text-sm font-medium tracking-wide text-accent">
            {linkArtist
              ? artistNames.map((name, i) => (
                  <span key={artistSlug(name)}>
                    {i > 0 ? " · " : null}
                    <Link
                      href={`/artists/${artistSlug(name)}`}
                      className="transition hover:underline"
                    >
                      {name}
                    </Link>
                  </span>
                ))
              : artistNames.join(" · ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {hasLyrics && (
            <Link
              href={`/bhajans/${current.slug}/sing`}
              className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              Singing mode
            </Link>
          )}
          {album && (
            <Link
              href={`/albums/${album.slug}`}
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              {albumTrackNo != null ? `Album · track ${albumTrackNo}` : "Album"}
            </Link>
          )}
          {hymnFolder && (
            <Link
              href={`/folders/${hymnFolder.slug}`}
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              {hymnFolder.title} folder
            </Link>
          )}
          {user && !current.id.startsWith("local-") && (
            <Link
              href={`/admin/bhajans/${current.id}/edit`}
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              Edit
            </Link>
          )}
          {current.pdf_url && (
            <a
              href={current.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              PDF
            </a>
          )}
          {current.youtube_url && (
            <a
              href={current.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              YouTube
            </a>
          )}
        </div>
      </header>

      {embed && (
        <QueueAwarePlayer
          kind="youtube"
          embedUrl={embed}
          title={current.title}
          cover={playerCover}
          artist={artistNames.join(" · ") || null}
          slug={current.slug}
          autoPlay={autoPlay}
          queueLabel={queueNote}
          prevHref={prevInQueue}
          nextHref={nextInQueue}
          prevTitle={queueNeighbors?.prevSlug ? navPrevTitle : null}
          nextTitle={queueNeighbors?.nextSlug ? navNextTitle : null}
          queueKey={queueKey}
          queueTracks={queueTracks}
        />
      )}

      {localVideo && current.audio_url && (
        <QueueAwarePlayer
          kind="video"
          src={current.audio_url}
          title={current.title}
          poster={playerCover}
          offerResume={videoOnly}
          autoPlay={autoPlay}
          queueLabel={queueNote}
          prevHref={prevInQueue}
          nextHref={nextInQueue}
          prevTitle={queueNeighbors?.prevSlug ? navPrevTitle : null}
          nextTitle={queueNeighbors?.nextSlug ? navNextTitle : null}
        />
      )}

      {(localAudio && current.audio_url) ||
      (current.video_url && isLocalVideoUrl(current.video_url)) ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {localAudio && current.audio_url ? (
            <div className="min-w-0 flex-1">
              <QueueAwarePlayer
                kind="audio"
                src={current.audio_url}
                title={current.title}
                cover={playerCover}
                coverAspect={current.player_cover_aspect}
                miniCover={
                  current.mini_cover_url ??
                  current.thumbnail_url ??
                  playerCover
                }
                artist={artistNames.join(" · ") || null}
                autoPlay={autoPlay}
                queueLabel={queueNote}
                prevHref={prevInQueue}
                nextHref={nextInQueue}
                prevTitle={queueNeighbors?.prevSlug ? navPrevTitle : null}
                nextTitle={queueNeighbors?.nextSlug ? navNextTitle : null}
                queueKey={queueKey}
                queueTracks={queueTracks}
                slug={current.slug}
              />
            </div>
          ) : null}

          {current.video_url && isLocalVideoUrl(current.video_url) ? (
            <CompanionVideo
              src={current.video_url}
              poster={current.video_poster_url}
              credit={current.video_credit}
            />
          ) : null}
        </div>
      ) : null}

      {current.audio_url && !embed && !localVideo && !localAudio && (
        <p>
          <a
            href={current.audio_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Open audio link
          </a>
        </p>
      )}

      {youtubeExtra && youtubeExtra !== embedFromAudio && (
        <div className="space-y-2">
          <p className="text-sm text-muted">Also on YouTube</p>
          <p>
            <a
              href={current.youtube_url!}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Watch on YouTube
            </a>
            <span className="text-sm text-muted">
              {" "}
              (opens externally — won&apos;t play over the queue)
            </span>
          </p>
        </div>
      )}

      {hasLyrics && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Lyrics
          </h2>
          <LyricsView
            roman={current.roman_lyrics}
            translation={current.translation}
            devanagari={current.devanagari_lyrics}
          />
        </section>
      )}

      {current.meaning && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-primary">
            {!hasLyrics || hideLyrics ? "About" : "Meaning"}
          </h2>
          <p className="leading-relaxed text-muted">{current.meaning}</p>
          {lyricsPermission && (
            <p className="leading-relaxed text-muted">
              These words belong to the writer. They will be added here once
              permission is in place.
            </p>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-primary">
          Categories
        </h2>
        <div className="space-y-5">
          {(Object.keys(byType) as CategoryType[]).map((type) => (
            <div key={type}>
              <h3 className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                {CATEGORY_TYPE_LABELS[type]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {byType[type].map((cat) => {
                  const base =
                    type === "bhagwan"
                      ? "/browse/bhagwan"
                      : type === "occasion"
                        ? "/browse/occasion"
                        : type === "bhajan_type"
                          ? "/browse/type"
                          : null;
                  const className =
                    "border border-border bg-surface px-3 py-1.5 text-sm transition hover:border-accent hover:bg-accent-soft";
                  return base ? (
                    <Link
                      key={cat.id}
                      href={`${base}/${cat.slug}`}
                      className={className}
                    >
                      {cat.name}
                    </Link>
                  ) : (
                    <span key={cat.id} className={className}>
                      {cat.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted">
        Added {formatDate(current.created_at)}
        {current.updated_at !== current.created_at &&
          ` · Updated ${formatDate(current.updated_at)}`}
      </p>

      <nav className="flex justify-between gap-3 border-t border-border pt-6 text-sm">
        {navPrev ? (
          queue ? (
            <AutoplayLink
              href={navPrev.href}
              className="font-medium text-accent transition hover:underline"
            >
              ← {navPrevTitle || navPrev.title}
            </AutoplayLink>
          ) : (
            <Link
              href={navPrev.href}
              className="font-medium text-accent transition hover:underline"
            >
              ← {navPrevTitle || navPrev.title}
            </Link>
          )
        ) : (
          <span />
        )}
        {navNext ? (
          queue ? (
            <AutoplayLink
              href={navNext.href}
              className="font-medium text-accent transition hover:underline"
            >
              {navNextTitle || navNext.title} →
            </AutoplayLink>
          ) : (
            <Link
              href={navNext.href}
              className="font-medium text-accent transition hover:underline"
            >
              {navNextTitle || navNext.title} →
            </Link>
          )
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
