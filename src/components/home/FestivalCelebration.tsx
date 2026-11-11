"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, Music, ArrowRight, Flame, ChevronRight } from "lucide-react";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import {
  bhajanPlayHref,
  markBhajanAutoplay,
  queueTracksFromBhajans,
  type PlayQueueRef,
} from "@/lib/play-queue";
import { getFolder } from "@/lib/folders";
import type { ActiveFestivalInfo } from "@/lib/festivals";
import type { BhajanWithCategories } from "@/lib/types";

function SmallRakhiSvg({ className = "h-5 w-auto inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Thread */}
      <path
        d="M2 12 Q 14 9, 26 12 T 38 12"
        stroke="#dc2626"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M2 12 Q 14 15, 26 12 T 38 12"
        stroke="#f59e0b"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="12" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
      <circle cx="26" cy="12" r="2.5" fill="#f43f5e" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="34" cy="12" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />

      {/* Right Thread */}
      <path
        d="M62 12 Q 74 9, 86 12 T 98 12"
        stroke="#dc2626"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M62 12 Q 74 15, 86 12 T 98 12"
        stroke="#f59e0b"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="66" cy="12" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
      <circle cx="74" cy="12" r="2.5" fill="#f43f5e" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="84" cy="12" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />

      {/* Central Dial */}
      <circle cx="50" cy="12" r="9.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="50" cy="12" r="7.5" fill="#ef4444" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="50" cy="12" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
      <circle cx="50" cy="12" r="3" fill="#991b1b" />
      <circle cx="48.8" cy="10.8" r="1" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

function KrishnaJanmashtamiIcon({
  className = "h-28 w-28 sm:h-32 sm:w-32",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-50/80 to-surface shadow-md ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/images/krishna-janmashtami-icon.png"
        alt=""
        fill
        sizes="(max-width: 640px) 112px, 128px"
        className="object-cover object-center"
        priority
      />
    </div>
  );
}

type Props = {
  currentFestivalInfo: ActiveFestivalInfo | null;
  upcomingFestivals?: ActiveFestivalInfo[];
  festivalsBhajansMap: Record<string, BhajanWithCategories[]>;
};

export function FestivalCelebration({
  currentFestivalInfo,
  festivalsBhajansMap,
}: Props) {
  if (!currentFestivalInfo) {
    return null;
  }

  const { festival, status, formattedDate, daysRemaining } = currentFestivalInfo;
  const bhajans = festivalsBhajansMap[festival.id] || [];
  const isRakshaBandhan = festival.id === "raksha-bandhan";
  const isJanmashtami = festival.id === "janmashtami";

  const playQueue: PlayQueueRef = {
    kind: "festival",
    id: festival.id,
  };

  const garbaSlugs = new Set(
    festival.id === "navratri" ? (getFolder("garba")?.member_slugs ?? []) : []
  );
  const featuredBhajans = bhajans.filter((b) => !garbaSlugs.has(b.slug));
  const garbaBhajans = bhajans.filter((b) => garbaSlugs.has(b.slug));
  const queueTracks = queueTracksFromBhajans(featuredBhajans, playQueue);

  const getBadge = () => {
    if (status === "today") {
      return {
        label: "Celebrating Today",
        icon: <Sparkles className="h-3.5 w-3.5 text-accent" />,
        className: "border-accent/40 bg-accent/10 text-accent",
      };
    }
    if (status === "active") {
      return {
        label: "Festival Week",
        icon: <Flame className="h-3.5 w-3.5 text-accent" />,
        className: "border-accent/30 bg-accent/10 text-accent",
      };
    }
    return {
      label: daysRemaining === 1 ? "Tomorrow" : `In ${daysRemaining} days`,
      icon: <Calendar className="h-3.5 w-3.5 text-muted" />,
      className: "border-border bg-surface-muted text-muted",
    };
  };

  const badge = getBadge();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-7 space-y-5">
      {/* Clean Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
          >
            {badge.icon}
            {badge.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-0.5 text-xs text-muted">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          {festival.hindiName && (
            <span className="text-xs text-muted/80 font-sans hidden sm:inline">
              · {festival.hindiName}
            </span>
          )}
        </div>

        {/* Calendar Link */}
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 self-start sm:self-auto text-xs font-medium text-muted hover:text-accent transition"
        >
          <Calendar className="h-3.5 w-3.5 text-accent" />
          <span>Hindu Calendar & Sync →</span>
        </Link>
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {festival.deity}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary">
              {festival.name}
            </h2>
            {isRakshaBandhan && <SmallRakhiSvg className="h-5 w-auto" />}
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {festival.tagline}
          </p>
        </div>

        {(isJanmashtami || queueTracks.length > 0) && (
          <div className="flex shrink-0 items-center gap-4 sm:gap-5 self-start sm:self-center">
            {isJanmashtami && <KrishnaJanmashtamiIcon />}
            {queueTracks.length > 0 && (
              <CollectionQueueActions
                queueKey={`festival:${festival.id}`}
                tracks={queueTracks}
                playAllHref={queueTracks[0]?.href}
              />
            )}
          </div>
        )}
      </div>

      {/* Featured Songs Grid */}
      {featuredBhajans.length > 0 ? (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Music className="h-3.5 w-3.5 text-accent" />
              Featured Songs
            </h3>
            {festival.categorySlug && (
              <Link
                href={`/browse/occasion/${festival.categorySlug}`}
                className="text-xs text-accent hover:underline flex items-center gap-0.5"
              >
                All {festival.name} songs
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          <SongGrid bhajans={featuredBhajans} playQueue={playQueue} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
          Songs for {festival.name} will be featured here soon.
        </div>
      )}

      {garbaBhajans.length > 0 && (
        <div className="space-y-2.5 border-t border-border/50 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Music className="h-3.5 w-3.5 text-accent" />
              Garba
            </h3>
            <Link
              href="/folders/garba"
              className="text-xs text-accent hover:underline flex items-center gap-0.5"
            >
              Garba folder
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <SongGrid
            bhajans={garbaBhajans}
            playQueue={{ kind: "folder", id: "garba" }}
          />
        </div>
      )}
    </section>
  );
}

function SongGrid({
  bhajans,
  playQueue,
}: {
  bhajans: BhajanWithCategories[];
  playQueue: PlayQueueRef;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {bhajans.map((b) => {
        const playHref = bhajanPlayHref(b.slug, playQueue, { autoplay: true });
        return (
          <Link
            key={b.slug}
            href={playHref}
            onClick={() => markBhajanAutoplay()}
            className="group flex items-center gap-3 rounded-xl border border-border/80 bg-surface-muted/40 p-2 transition hover:border-accent/40 hover:bg-accent-soft/30"
          >
            {b.thumbnail_url ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                <Image
                  src={b.thumbnail_url}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover object-center transition group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted text-muted">
                <Music className="h-4 w-4 text-accent" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-semibold text-primary transition group-hover:text-accent">
                {b.title}
              </p>
              {b.artist_version && (
                <p className="truncate text-[11px] text-muted">{b.artist_version}</p>
              )}
            </div>

            <div className="shrink-0 pr-1 opacity-0 transition group-hover:opacity-100">
              <ArrowRight className="h-3.5 w-3.5 text-accent" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
