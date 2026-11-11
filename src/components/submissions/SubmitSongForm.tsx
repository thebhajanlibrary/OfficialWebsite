"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  Music,
  Video,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import { submitSongAction, type SubmitSongResult } from "@/lib/submission-actions";
import type { Category, CategoryType } from "@/lib/types";
import { CATEGORY_TYPE_LABELS } from "@/lib/types";

type Props = {
  categories: Category[];
};

const SECTIONS = [
  {
    id: "bhajans",
    label: "Bhajan / Devotional",
    desc: "Classical, satsang, kirtan, prarthana, or aarti",
  },
  {
    id: "chutney",
    label: "Traditional Chutney",
    desc: "Caribbean / Guyanese / Surinamese / Trinidadian folk & baithak gana",
  },
  {
    id: "wedding",
    label: "Wedding Folk",
    desc: "Matkorwa, lawa, sehra, bidai, or traditional wedding songs",
  },
  {
    id: "chowtal",
    label: "Chowtal / Phagwah",
    desc: "Holi chowtal, jhumar, kabir, or dhamar",
  },
] as const;

const POPULAR_DEITIES = [
  "shiva",
  "ram",
  "krishna",
  "hanuman",
  "ganesh",
  "durga",
  "lakshmi",
  "saraswati",
  "vishnu",
  "kali",
  "guru",
  "ganga",
  "general",
];

export function SubmitSongForm({ categories }: Props) {
  const [state, formAction, isPending] = useActionState<
    SubmitSongResult | null,
    FormData
  >(submitSongAction, null);

  const [section, setSection] = useState<string>("bhajans");
  const [mediaType, setMediaType] = useState<"youtube" | "file">("youtube");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(["general", "devotion", "hindi"])
  );
  const [showAllCategories, setShowAllCategories] = useState(false);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  if (state?.success) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/80 bg-surface/90 p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold text-primary">
          Thank you for your submission!
        </h2>
        <p className="mt-3 text-base text-muted">
          Your song has been received and added to our review queue. Once approved by
          the admin team, it will go live in the library for everyone to enjoy and
          sing along to.
        </p>
        <div className="mt-6 rounded-2xl border border-border/60 bg-surface-muted/50 p-4 text-left text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Submission Reference
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">
            {state.submissionId}
          </p>
          <p className="mt-2 text-xs text-muted">
            Status:{" "}
            <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent">
              Pending Review
            </span>
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-accent"
          >
            Back to Library
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Submit Another Song
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-8">
      {state?.errors?.media && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{state.errors.media}</p>
        </div>
      )}

      {/* 1. Category / Section */}
      <section className="space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-primary">
              1. Song Type &amp; Classification
            </h3>
            <p className="text-xs text-muted">
              Choose which section and categories best fit this song
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((sec) => (
            <label
              key={sec.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                section === sec.id
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-surface hover:border-accent/50"
              }`}
            >
              <input
                type="radio"
                name="section"
                value={sec.id}
                checked={section === sec.id}
                onChange={() => setSection(sec.id)}
                className="sr-only"
              />
              <p className="font-semibold text-primary">{sec.label}</p>
              <p className="mt-1 text-xs text-muted">{sec.desc}</p>
            </label>
          ))}
        </div>

        {/* Categories / Deities Tags */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Themes, Deities &amp; Occasions
            </span>
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className="text-xs font-medium text-accent hover:underline"
            >
              {showAllCategories ? "Show less" : "Show all categories"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories
              .filter((cat) => showAllCategories || POPULAR_DEITIES.includes(cat.slug))
              .map((cat) => {
                const isSelected = selectedCategories.has(cat.slug);
                return (
                  <label
                    key={cat.slug}
                    className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                      isSelected
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-surface text-foreground/80 hover:border-accent/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="category_slugs"
                      value={cat.slug}
                      checked={isSelected}
                      onChange={() => toggleCategory(cat.slug)}
                      className="sr-only"
                    />
                    {cat.name}
                  </label>
                );
              })}
          </div>
        </div>
      </section>

      {/* 2. Song Details */}
      <section className="space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-primary">
              2. Song Information
            </h3>
            <p className="text-xs text-muted">Title, singer, and background</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">
              Song Title <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Jai Jai Hanuman, Sone Ke Kharaun, Lingashtakam"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
            {state?.errors?.title && (
              <p className="text-xs text-red-500">{state.errors.title}</p>
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Alternate Title / Subtitle{" "}
              <span className="text-xs text-muted font-normal">(Optional)</span>
            </span>
            <input
              type="text"
              name="alternate_title"
              placeholder="e.g. Album track, Vivah Geet, Bhairavi"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Artist / Singer Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="artist_name"
              required
              placeholder="e.g. Hari Om Sharan, Dropati, Ankit Batra"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
            {state?.errors?.artist_name && (
              <p className="text-xs text-red-500">{state.errors.artist_name}</p>
            )}
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground">
            Meaning / Song Context{" "}
            <span className="text-xs text-muted font-normal">(Optional)</span>
          </span>
          <textarea
            name="meaning"
            rows={2}
            placeholder="Briefly describe the story, deity praised, or emotional theme behind the song..."
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>
      </section>

      {/* 3. Audio & Media */}
      <section className="space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-primary">
              3. Audio / Video Source
            </h3>
            <p className="text-xs text-muted">
              Add a YouTube link or upload an audio recording
            </p>
          </div>
        </div>

        {/* Media Type Switcher */}
        <div className="inline-flex rounded-2xl border border-border bg-surface-muted/50 p-1">
          <button
            type="button"
            onClick={() => setMediaType("youtube")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              mediaType === "youtube"
                ? "bg-surface text-primary shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Video className="h-4 w-4 text-red-500" />
            YouTube Link
          </button>
          <button
            type="button"
            onClick={() => setMediaType("file")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              mediaType === "file"
                ? "bg-surface text-primary shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <UploadCloud className="h-4 w-4 text-accent" />
            Upload Audio File (MP3)
          </button>
        </div>

        {mediaType === "youtube" ? (
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              YouTube Video URL
            </span>
            <input
              type="url"
              name="youtube_url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
            <span className="block text-xs text-muted">
              Paste standard YouTube link or youtu.be shortlink.
            </span>
          </label>
        ) : (
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-foreground">
                Select Audio File (.mp3, .m4a, .wav)
              </span>
              <input
                type="file"
                name="audio_file"
                accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/x-m4a,audio/ogg"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted">
                Or Direct Audio Link (Optional URL)
              </span>
              <input
                type="url"
                name="audio_url"
                placeholder="https://example.com/audio/my-song.mp3"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none"
              />
            </label>
          </div>
        )}

        {/* Cover image */}
        <div className="pt-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Cover Artwork / Thumbnail{" "}
              <span className="text-xs text-muted font-normal">(Optional)</span>
            </span>
            <input
              type="file"
              name="image_file"
              accept="image/png,image/jpeg,image/webp"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
            />
          </label>
        </div>
      </section>

      {/* 4. Lyrics & Translation */}
      <section className="space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-primary">
              4. Lyrics &amp; English Translation
            </h3>
            <p className="text-xs text-muted">
              Add Roman / English lyrics and optional line-by-line translation
            </p>
          </div>
        </div>

        <label className="block space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Roman / English Transliterated Lyrics{" "}
              <span className="text-red-500">*</span>
            </span>
            <span className="text-xs text-muted">Use ## Refrain or ## Verse headers</span>
          </div>
          <textarea
            name="roman_lyrics"
            required
            rows={8}
            placeholder={`## Refrain\n\nJai Jai Hanuman Gosai...\n\n## Verse 1\n\nJai Kapis Tihun Lok Ujagar...`}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm leading-relaxed text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
          {state?.errors?.roman_lyrics && (
            <p className="text-xs text-red-500">{state.errors.roman_lyrics}</p>
          )}
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground">
            Line-by-Line English Translation{" "}
            <span className="text-xs text-muted font-normal">(Optional)</span>
          </span>
          <textarea
            name="translation"
            rows={6}
            placeholder={`## Refrain\n\nVictory to Lord Hanuman...\n\n## Verse 1\n\nGlory to the monkey Lord who enlightens the three worlds...`}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm leading-relaxed text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground">
            Devanagari / Hindi Lyrics{" "}
            <span className="text-xs text-muted font-normal">(Optional)</span>
          </span>
          <textarea
            name="devanagari_lyrics"
            rows={4}
            placeholder={`## दोहा\n\nश्रीगुरु चरन सरोज रज...`}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm leading-relaxed text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>
      </section>

      {/* 5. Submitter Info */}
      <section className="space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8">
        <h3 className="font-display text-xl font-semibold text-primary">
          5. Your Details (Optional)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">Your Name</span>
            <input
              type="text"
              name="submitter_name"
              placeholder="e.g. Arjun"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-foreground">
              Email Address (for update notification)
            </span>
            <input
              type="email"
              name="submitter_email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-foreground">
            Notes for the Admin Team
          </span>
          <input
            type="text"
            name="submitter_notes"
            placeholder="e.g. Sung in Baithak Gana style, recorded live in Suriname..."
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>
      </section>

      <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
        <p className="text-xs text-muted">
          All submissions are reviewed by the community admins before going live.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 font-display text-base font-semibold text-white shadow-lg transition hover:bg-primary-hover disabled:opacity-50"
        >
          {isPending ? (
            "Submitting Song..."
          ) : (
            <>
              Submit Song for Review
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
