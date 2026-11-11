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

  neighborsInWedding,

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

  const { current } = neighborsInWedding(slug);

  return {

    title: current ? `${current.title} · Wedding` : "Wedding Songs",

  };

}



export default async function WeddingDetailPage({ params, searchParams }: Props) {

  const { slug } = await params;

  const sp = await searchParams;

  const { current, prev, next } = neighborsInWedding(slug);

  if (!current) notFound();



  const performerCredit = chutneyPerformerCredit(current.artist);

  const queueMedia = primaryQueueMedia(current);

  const embed = queueMedia.youtubeEmbedUrl ?? youtubeEmbedUrl(current.youtube_url);

  const poster =

    youtubePosterUrl(current.youtube_url) ??

    current.cover_url ??

    current.thumbnail_url;

  const alsoChutney = (current.sections ?? ["chutney"]).includes("chutney");

  const versions = current.audio_versions ?? [];

  const localAudio = primaryAudioUrl(current);

  const queueTracks = folkQueueTracks("wedding");

  const autoPlay = sp.autoplay === "1";

  const initialVersionId = sp.v?.trim() || null;



  return (

    <article className="space-y-10">

      <header className="space-y-4">

        <p className="text-sm text-muted">

          <Link href="/folders/wedding" className="transition hover:text-primary">

            Wedding Songs

          </Link>

          {alsoChutney && (

            <>

              <span className="mx-2 text-border">·</span>

              <Link href="/chutney" className="transition hover:text-primary">

                Traditional Chutney

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

            href="/folders/wedding"

            className="btn-secondary rounded-lg px-4 py-2.5 text-sm"

          >

            All Wedding Songs

          </Link>

          {alsoChutney && (

            <Link

              href={`/chutney/${current.slug}`}

              className="btn-secondary rounded-lg px-4 py-2.5 text-sm"

            >

              View in Chutney

            </Link>

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

          href={`/wedding/${current.slug}`}

          autoPlay={autoPlay}

          initialVersionId={initialVersionId}

          queueKey="wedding:all"

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

          href={`/wedding/${current.slug}`}

          autoPlay={autoPlay}

          queueKey="wedding:all"

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

          href={`/wedding/${current.slug}`}

          autoPlay={autoPlay}

          queueKey="wedding:all"

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

            href={`/wedding/${prev.slug}`}

            className="font-medium text-accent transition hover:underline"

          >

            ← {prev.title}

          </Link>

        ) : (

          <span />

        )}

        {next ? (

          <Link

            href={`/wedding/${next.slug}`}

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

