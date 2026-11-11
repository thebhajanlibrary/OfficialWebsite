import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { SubmitSongForm } from "@/components/submissions/SubmitSongForm";
import { UploadCloud, Sparkles, CheckCircle2, Music2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Upload & Submit a Song",
  description:
    "Contribute new bhajans, traditional chutney, wedding folk, or chowtals to the library.",
};

export default async function UploadSongPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-10 py-4 sm:py-8">
      {/* Hero Header */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          Community Contribution
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
          Upload &amp; Submit a Song
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted sm:text-lg">
          Add new bhajans, traditional chutney tracks, wedding folk songs, or chowtals.
          Share your favorite recordings and lyrics with the community!
        </p>
      </div>

      {/* Feature highlights */}
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-surface/60 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-primary">YouTube or MP3</p>
            <p className="text-muted">Link a video or upload audio directly</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-surface/60 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Music2 className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-primary">Lyrics &amp; Translation</p>
            <p className="text-muted">Roman, Devanagari &amp; English meanings</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-surface/60 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-primary">Admin Reviewed</p>
            <p className="text-muted">Verified before going live to all</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <SubmitSongForm categories={categories} />
    </div>
  );
}
