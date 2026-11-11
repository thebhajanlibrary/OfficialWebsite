import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSubmissions,
  getSubmissionCounts,
  type SubmissionStatus,
} from "@/lib/submissions";
import {
  Clock,
  CheckCircle,
  XCircle,
  Music,
  Video,
  FileAudio,
  ArrowRight,
  Sparkles,
  Inbox,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Song Submissions Review · Admin",
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminSubmissionsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const currentStatus = sp.status || "all";

  const allSubmissions = getAllSubmissions();
  const counts = getSubmissionCounts();

  const filtered =
    currentStatus === "all"
      ? allSubmissions
      : allSubmissions.filter((s) => s.status === (currentStatus as SubmissionStatus));

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" />
            Admin Dashboard
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-primary">
            Community Song Submissions
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review, preview, edit, approve, or reject user-submitted songs.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/upload"
            target="_blank"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium hover:border-accent"
          >
            Open Public Form ↗
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium hover:border-accent"
          >
            ← Back to Admin
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/submissions"
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            currentStatus === "all"
              ? "bg-primary text-white shadow-sm"
              : "border border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          All
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              currentStatus === "all" ? "bg-white/20 text-white" : "bg-surface-muted"
            }`}
          >
            {counts.total}
          </span>
        </Link>

        <Link
          href="/admin/submissions?status=pending"
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            currentStatus === "pending"
              ? "bg-amber-600 text-white shadow-sm"
              : "border border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Pending Review
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              currentStatus === "pending"
                ? "bg-white/20 text-white"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
            }`}
          >
            {counts.pending}
          </span>
        </Link>

        <Link
          href="/admin/submissions?status=approved"
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            currentStatus === "approved"
              ? "bg-emerald-600 text-white shadow-sm"
              : "border border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Approved
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              currentStatus === "approved"
                ? "bg-white/20 text-white"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {counts.approved}
          </span>
        </Link>

        <Link
          href="/admin/submissions?status=rejected"
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            currentStatus === "rejected"
              ? "bg-red-600 text-white shadow-sm"
              : "border border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          <XCircle className="h-3.5 w-3.5" />
          Rejected
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              currentStatus === "rejected"
                ? "bg-white/20 text-white"
                : "bg-red-500/15 text-red-600 dark:text-red-400"
            }`}
          >
            {counts.rejected}
          </span>
        </Link>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <Inbox className="mx-auto h-12 w-12 text-muted/40" />
          <h3 className="mt-4 font-display text-lg font-semibold text-primary">
            No submissions found
          </h3>
          <p className="mt-1 text-sm text-muted">
            {currentStatus === "pending"
              ? "All submitted songs have been reviewed! New submissions will appear here."
              : "No song submissions match this filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <ul className="divide-y divide-border">
            {filtered.map((item) => {
              const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-surface-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/submissions/${item.id}`}
                        className="font-display text-lg font-semibold text-primary hover:text-accent transition"
                      >
                        {item.title}
                      </Link>

                      {/* Status badge */}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <Clock className="h-3 w-3" />
                          Pending Review
                        </span>
                      )}
                      {item.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </span>
                      )}

                      {/* Section badge */}
                      <span className="rounded-lg border border-border/80 bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {item.section}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="font-medium text-foreground">
                        Artist: {item.artist_name}
                      </span>
                      <span>·</span>
                      <span>Submitted: {dateStr}</span>
                      {item.submitter_name && (
                        <>
                          <span>·</span>
                          <span>By: {item.submitter_name}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted">
                      {item.youtube_url && (
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <Video className="h-3.5 w-3.5" />
                          YouTube Video
                        </span>
                      )}
                      {item.audio_url && (
                        <span className="inline-flex items-center gap-1 text-accent font-medium">
                          <FileAudio className="h-3.5 w-3.5" />
                          Audio File
                        </span>
                      )}
                      {item.translation && (
                        <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[11px]">
                          + English Translation
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/admin/submissions/${item.id}`}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:bg-surface-muted"
                    >
                      Review Song
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
