import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmissionById, generateSuggestedSlug } from "@/lib/submissions";
import { getCategories } from "@/lib/queries";
import {
  deleteSubmissionAction,
  editSubmissionDetailsAction,
  updateSubmissionStatusAction,
} from "@/lib/submission-actions";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  FileAudio,
  Trash2,
  Save,
  Sparkles,
  Code2,
} from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Review Submission · Admin",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReviewSubmissionDetailPage({ params }: Props) {
  const { id } = await params;
  const submission = getSubmissionById(id);
  if (!submission) notFound();

  const categories = await getCategories();
  const embedUrl = submission.youtube_url
    ? youtubeEmbedUrl(submission.youtube_url)
    : null;
  const suggestedSlug = generateSuggestedSlug(
    submission.title,
    submission.artist_name
  );

  const codeSnippet = `  "${suggestedSlug}": {
    title: ${JSON.stringify(submission.title)},
    alternate_title: ${JSON.stringify(submission.alternate_title ?? "")},
    artist_version: ${JSON.stringify(submission.artist_name)},
    audio_url: ${JSON.stringify(submission.audio_url ?? submission.youtube_url ?? "")},
    youtube_url: ${JSON.stringify(submission.youtube_url ?? "")},
    thumbnail_url: ${JSON.stringify(submission.thumbnail_url ?? "")},
    cover_url: ${JSON.stringify(submission.thumbnail_url ?? "")},
    display_order: 300,
    category_slugs: ${JSON.stringify(submission.category_slugs)},
    meaning: ${JSON.stringify(submission.meaning ?? "")},
    roman_lyrics: \`${submission.roman_lyrics.replace(/`/g, "\\`")}\`,
    translation: \`${(submission.translation ?? "").replace(/`/g, "\\`")}\`,
  },`;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button & header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Submissions
          </Link>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Review: {submission.title}
          </h1>
          <p className="text-xs text-muted">
            Submitted by{" "}
            <span className="font-semibold text-foreground">
              {submission.submitter_name || "Anonymous"}
            </span>{" "}
            ({submission.submitter_email || "no email"}) on{" "}
            {new Date(submission.created_at).toLocaleString()}
          </p>
        </div>

        {/* Quick Status Pill */}
        <div className="flex items-center gap-2">
          {submission.status === "pending" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <Clock className="h-3.5 w-3.5" />
              Pending Review
            </span>
          )}
          {submission.status === "approved" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approved
            </span>
          )}
          {submission.status === "rejected" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
              <XCircle className="h-3.5 w-3.5" />
              Rejected
            </span>
          )}
        </div>
      </div>

      {/* Media Player Preview */}
      <div className="rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          Media Preview
        </h2>

        {embedUrl ? (
          <div className="space-y-2">
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-black shadow-md">
              <iframe
                src={embedUrl}
                title={submission.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <p className="text-xs text-muted">
              YouTube URL:{" "}
              <a
                href={submission.youtube_url!}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                {submission.youtube_url}
              </a>
            </p>
          </div>
        ) : submission.audio_url ? (
          <div className="space-y-3 max-w-xl">
            <div className="rounded-2xl border border-border bg-surface-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent mb-2">
                <FileAudio className="h-4 w-4" />
                Uploaded Audio File
              </div>
              <audio controls src={submission.audio_url} className="w-full" />
            </div>
            <p className="text-xs text-muted">File URL: {submission.audio_url}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">No media link or audio file attached.</p>
        )}
      </div>

      {/* Quick Approval & Rejection Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Approve Box */}
        <form
          action={updateSubmissionStatusAction}
          className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-sm space-y-3"
        >
          <input type="hidden" name="id" value={submission.id} />
          <input type="hidden" name="status" value="approved" />
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-display font-semibold text-lg">
            <CheckCircle2 className="h-5 w-5" />
            Approve Submission
          </div>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">
            Mark this submission as verified and approved for inclusion in the
            library.
          </p>
          <input
            type="text"
            name="admin_notes"
            placeholder="Optional approval note (e.g. Added to bhajan-content.ts)"
            defaultValue={submission.admin_notes ?? ""}
            className="w-full rounded-xl border border-emerald-500/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Mark as Approved
          </button>
        </form>

        {/* Reject Box */}
        <form
          action={updateSubmissionStatusAction}
          className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 shadow-sm space-y-3"
        >
          <input type="hidden" name="id" value={submission.id} />
          <input type="hidden" name="status" value="rejected" />
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-display font-semibold text-lg">
            <XCircle className="h-5 w-5" />
            Reject Submission
          </div>
          <p className="text-xs text-red-800/80 dark:text-red-200/80">
            Reject if this song is duplicate, low quality, or not suitable.
          </p>
          <input
            type="text"
            name="admin_notes"
            placeholder="Reason for rejection..."
            defaultValue={submission.admin_notes ?? ""}
            className="w-full rounded-xl border border-red-500/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Mark as Rejected
          </button>
        </form>
      </div>

      {/* Edit & Fine-tune Form */}
      <div className="rounded-3xl border border-border/80 bg-surface/90 p-6 sm:p-8 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary mb-2">
          Edit Submission Content
        </h2>
        <p className="text-xs text-muted mb-6">
          You can fix spelling, improve transliteration, or correct categories before
          approving.
        </p>

        <form action={editSubmissionDetailsAction} className="space-y-6">
          <input type="hidden" name="id" value={submission.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Song Title
              </span>
              <input
                type="text"
                name="title"
                defaultValue={submission.title}
                required
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Alternate Title
              </span>
              <input
                type="text"
                name="alternate_title"
                defaultValue={submission.alternate_title ?? ""}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Artist Name
              </span>
              <input
                type="text"
                name="artist_name"
                defaultValue={submission.artist_name}
                required
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Section
              </span>
              <select
                name="section"
                defaultValue={submission.section}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              >
                <option value="bhajans">Bhajans / Devotional</option>
                <option value="chutney">Traditional Chutney</option>
                <option value="wedding">Wedding Folk</option>
                <option value="chowtal">Chowtal / Phagwah</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                YouTube Link
              </span>
              <input
                type="url"
                name="youtube_url"
                defaultValue={submission.youtube_url ?? ""}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Audio URL / File Path
              </span>
              <input
                type="text"
                name="audio_url"
                defaultValue={submission.audio_url ?? ""}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-semibold uppercase text-muted">
              Meaning / Context
            </span>
            <textarea
              name="meaning"
              rows={2}
              defaultValue={submission.meaning ?? ""}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Roman / English Transliteration Lyrics
              </span>
              <textarea
                name="roman_lyrics"
                rows={10}
                defaultValue={submission.roman_lyrics}
                required
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs leading-relaxed text-foreground focus:border-accent focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold uppercase text-muted">
                Line-by-Line English Translation
              </span>
              <textarea
                name="translation"
                rows={10}
                defaultValue={submission.translation ?? ""}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs leading-relaxed text-foreground focus:border-accent focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-sm"
            >
              <Save className="h-4 w-4" />
              Save Edits
            </button>

            <button
              formAction={deleteSubmissionAction}
              type="submit"
              onClick={(e) => {
                if (
                  !confirm(
                    "Are you sure you want to permanently delete this submission?"
                  )
                ) {
                  e.preventDefault();
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/40 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Submission
            </button>
          </div>
        </form>
      </div>

      {/* Code Generator Card for Admin */}
      <div className="rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <Code2 className="h-5 w-5 text-accent" />
          TypeScript Catalogue Code Snippet
        </div>
        <p className="text-xs text-muted">
          Ready-to-paste definition for{" "}
          <code className="text-accent font-mono">
            {submission.section === "chutney"
              ? "src/lib/chutney.ts"
              : "src/lib/bhajan-content.ts"}
          </code>
          :
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-border bg-black/80 p-4 font-mono text-xs text-white/90">
          {codeSnippet}
        </pre>
      </div>
    </div>
  );
}
