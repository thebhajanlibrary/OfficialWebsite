import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LyricsView } from "@/components/bhajan/LyricsView";
import { QueueAwarePlayer } from "@/components/bhajan/QueueAwarePlayer";
import {
  CHOWTAL_KIND_LABELS,
  neighborsInChowtal,
} from "@/lib/chowtal";
import { chowtalMeaningParagraphs } from "@/lib/chowtal-meaning";
import { youtubeEmbedUrl, youtubePosterUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = neighborsInChowtal(slug);
  return { title: current ? `${current.title} · Chowtal` : "Chowtal" };
}

export default async function ChowtalDetailPage({ params }: Props) {
  const { slug } = await params;
  const { current, prev, next } = neighborsInChowtal(slug);
  if (!current) notFound();

  const meaning = current.translation
    ? chowtalMeaningParagraphs(current.translation)
    : [];
  const embed = youtubeEmbedUrl(current.youtube_url);
  const poster = youtubePosterUrl(current.youtube_url);

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm text-muted">
          <Link href="/chowtal" className="transition hover:text-primary">
            Chowtal
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link
            href={`/chowtal#${current.kind}`}
            className="transition hover:text-primary"
          >
            {CHOWTAL_KIND_LABELS[current.kind]}
          </Link>
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
          {current.title}
        </h1>
        {current.cue && <p className="text-muted">{current.cue}</p>}

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/chowtal/${current.slug}/sing`}
            className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            Singing mode
          </Link>
          <Link
            href="/chowtal"
            className="btn-secondary rounded-lg px-4 py-2.5 text-sm"
          >
            All Chowtal
          </Link>
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
          cover={poster}
          slug={current.slug}
          href={`/chowtal/${current.slug}`}
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

      {meaning.length > 0 && (
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Meaning
          </h2>
          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            {meaning.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <nav className="flex justify-between gap-3 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link
            href={`/chowtal/${prev.slug}`}
            className="font-medium text-accent transition hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/chowtal/${next.slug}`}
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
