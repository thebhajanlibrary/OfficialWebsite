"use client";

import { useEffect, useRef } from "react";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useYouTubePlaybackOptional } from "@/components/bhajan/YouTubePlayback";

type Props = {
  src: string;
  poster?: string | null;
  credit?: string | null;
};

/** Portrait clip beside the song. Starting it pauses the song, and the song pauses this clip. */
export function CompanionVideo({ src, poster, credit }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const queue = useQueuePlaybackOptional();
  const youtube = useYouTubePlaybackOptional();
  const queueRef = useRef(queue);
  const youtubeRef = useRef(youtube);
  queueRef.current = queue;
  youtubeRef.current = youtube;

  useEffect(() => {
    const onSong = () => {
      videoRef.current?.pause();
    };
    window.addEventListener("bhajan-audio-playing", onSong);
    return () => window.removeEventListener("bhajan-audio-playing", onSong);
  }, []);

  const onPlay = () => {
    queueRef.current?.pauseOutput();
    youtubeRef.current?.clear();
    document.querySelectorAll("audio").forEach((el) => {
      if (!el.paused) el.pause();
    });
  };

  return (
    <aside className="mx-auto w-full max-w-[260px] shrink-0 space-y-2 lg:mx-0">
      <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            src={src}
            poster={poster ?? undefined}
            className="absolute inset-0 h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
            onPlay={onPlay}
          />
        </div>
      </div>
      {credit ? (
        <p className="text-sm leading-relaxed text-muted">{credit}</p>
      ) : null}
    </aside>
  );
}
