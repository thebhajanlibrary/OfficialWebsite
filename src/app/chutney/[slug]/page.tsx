import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChutneyVersionPlayer } from "@/components/bhajan/ChutneyVersionPlayer";
import { LyricsView } from "@/components/bhajan/LyricsView";
import { QueueAwarePlayer } from "@/components/bhajan/QueueAwarePlayer";
import { ChutneyCredits } from "@/components/chutney/ChutneyCredits";
import {
  chutneyPerformerCredit,
  folkQueueTracks,
  neighborsInChutney,
  primaryAudioUrl,
  primaryQueueMedia,
} from "@/lib/chutney";
import { youtubeEmbedUrl, youtubePosterUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autoplay?: string; v?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = neighborsInChutney(slug);
  return {
    title: current
      ? `${current.title} · Traditional Chutney`
      : "Traditional Chutney",
  };
}

export default async function ChutneyDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const { current, prev, next } = neighborsInChutney(slug);
  if (!current) notFound();

  const performerCredit = chutneyPerformerCredit(current.artist);
  const queueMedia = primaryQueueMedia(current);
  const embed = queueMedia.youtubeEmbedUrl ?? youtubeEmbedUrl(current.youtube_url);
  const poster =
    youtubePosterUrl(current.youtube_url) ??
    current.cover_url ??
    current.thumbnail_url;
  const alsoWedding = (current.sections ?? ["chutney"]).includes("wedding");
  const versions = current.audio_versions ?? [];
  const localAudio = primaryAudioUrl(current);
  const queueTracks = folkQueueTracks("chutney");
  const autoPlay = sp.autoplay === "1";
  const initialVersionId = sp.v?.trim() || null;

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm text-muted">
          <Link href="/chutney" className="transition hover:text-primary">
            Traditional Chutney
          </Link>
          {alsoWedding && (
            <>
              <span className="mx-2 text-border">·</span>
              <Link href="/folders/wedding" className="transition hover:text-primary">
                Wedding Songs
              </Link>
            </>
          )}
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
          {current.title}
        </h1>
        {current.artist && (
          <ChutneyCredits artist={current.artist} remixer={current.remixer} />
        )}
        {current.cue && <p className="text-muted">{current.cue}</p>}
        {current.about && (
          <p className="max-w-2xl text-muted leading-relaxed">{current.about}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/chutney"
            className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
          >
            All Traditional Chutney
          </Link>
          <Link
            href="/chutney/artists"
            className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
          >
            Chutney Artists
          </Link>
          {alsoWedding && (
            <Link
              href={`/wedding/${current.slug}`}
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
            >
              View in Wedding
            </Link>
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

      {versions.length > 1 ? (
        <ChutneyVersionPlayer
          versions={versions}
          title={current.title}
          artist={performerCredit ?? current.artist}
          cover={current.cover_url ?? current.thumbnail_url ?? poster}
          slug={current.slug}
          href={`/chutney/${current.slug}`}
          autoPlay={autoPlay}
          initialVersionId={initialVersionId}
          queueKey="chutney:all"
          queueTracks={queueTracks}
        />
      ) : localAudio ? (
        <QueueAwarePlayer
          kind="audio"
          src={localAudio}
          title={current.title}
          artist={performerCredit ?? current.artist}
          cover={current.cover_url ?? current.thumbnail_url ?? poster}
          slug={current.slug}
          href={`/chutney/${current.slug}`}
          autoPlay={autoPlay}
          queueKey="chutney:all"
          queueTracks={queueTracks}
        />
      ) : null}

      {embed && !localAudio && versions.length === 0 && (
        <QueueAwarePlayer
          kind="youtube"
          embedUrl={embed}
          title={current.title}
          cover={poster ?? current.thumbnail_url}
          artist={performerCredit ?? current.artist}
          slug={current.slug}
          href={`/chutney/${current.slug}`}
          autoPlay={autoPlay}
          queueKey="chutney:all"
          queueTracks={queueTracks}
        />
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-primary">
          Lyrics
        </h2>
        <LyricsView
          roman={current.roman_lyrics}
          translation={current.translation}
        />
      </section>

      <nav className="flex justify-between gap-3 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link
            href={`/chutney/${prev.slug}`}
            className="font-medium text-accent transition hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/chutney/${next.slug}`}
            className="font-medium text-accent transition hover:underline"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
