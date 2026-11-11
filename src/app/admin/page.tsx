import type { Metadata } from "next";
import Link from "next/link";
import {
  deleteBhajanAction,
  deletePlaylistAction,
} from "@/lib/actions";
import { getBhajans, getPlaylists } from "@/lib/queries";
import { getSubmissionCounts } from "@/lib/submissions";
import { Clock, Inbox, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [bhajans, playlists] = await Promise.all([getBhajans(), getPlaylists()]);
  const submissionCounts = getSubmissionCounts();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Admin
          </h1>
          <p className="mt-1 text-muted">Manage bhajans, playlists, and community uploads.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/submissions"
            className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
          >
            <Inbox className="h-4 w-4" />
            Review Submissions
            {submissionCounts.pending > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                {submissionCounts.pending}
              </span>
            )}
          </Link>
          <Link
            href="/admin/bhajans/new"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Add bhajan
          </Link>
          <Link
            href="/admin/playlists/new"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm hover:border-accent"
          >
            New playlist
          </Link>
        </div>
      </div>

      {/* Submissions Highlight Widget */}
      <div className="rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/10 via-surface to-surface p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Community Uploads
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary">
              Song Submissions Queue
            </h2>
            <p className="text-sm text-muted">
              {submissionCounts.pending > 0 ? (
                <span>
                  You have{" "}
                  <strong className="text-accent font-semibold">
                    {submissionCounts.pending} song{submissionCounts.pending === 1 ? "" : "s"}
                  </strong>{" "}
                  waiting for your review.
                </span>
              ) : (
                "No pending submissions. All submitted songs have been reviewed."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 text-xs">
              <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-medium text-amber-700 dark:text-amber-300">
                {submissionCounts.pending} Pending
              </span>
              <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                {submissionCounts.approved} Approved
              </span>
            </div>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              Open Submissions Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-primary">Bhajans</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {bhajans.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/bhajans/${b.slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {b.title}
                  </Link>
                  {b.artist_version && (
                    <p className="text-sm text-muted">{b.artist_version}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/bhajans/${b.id}/edit`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted"
                  >
                    Edit
                  </Link>
                  <form action={deleteBhajanAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-danger/30 px-3 py-1.5 text-sm text-danger hover:bg-surface-muted"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {bhajans.length === 0 && (
              <li className="p-4 text-sm text-muted">No bhajans yet.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-primary">Playlists</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {playlists.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/playlists/${p.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {p.name}
                </Link>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/playlists/${p.id}/edit`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted"
                  >
                    Edit
                  </Link>
                  <form action={deletePlaylistAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-danger/30 px-3 py-1.5 text-sm text-danger hover:bg-surface-muted"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {playlists.length === 0 && (
              <li className="p-4 text-sm text-muted">No playlists yet.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
