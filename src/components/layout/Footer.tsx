import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="flex items-center gap-2.5 font-display text-lg font-semibold text-primary">
            <BrandMark className="h-8 w-8" />
            Bhajan Library
          </p>
          <p className="mt-1 text-muted">
            Lyrics and recordings for satsang — organised by path, artist, and
            occasion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
          <Link href="/calendar" className="transition hover:text-accent">
            Hindu Calendar
          </Link>
          <span>·</span>
          <Link href="/upload" className="transition hover:text-accent">
            Upload Song
          </Link>
          <span>·</span>
          <Link href="/admin" className="transition hover:text-accent">
            Admin
          </Link>
          <span>·</span>
          <span className="text-muted/70">© {year} Bhajan Library</span>
        </div>
      </div>
    </footer>
  );
}
