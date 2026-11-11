"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LyricsView } from "@/components/bhajan/LyricsView";

type Item = {
  slug: string;
  title: string;
  roman_lyrics: string;
  devanagari_lyrics?: string | null;
  translation?: string | null;
};

type NavItem = { href: string; title: string };

type Props = {
  current: Item;
  prev?: NavItem | null;
  next?: NavItem | null;
  backHref: string;
  backLabel?: string;
};

export function SingingMode({
  current,
  prev,
  next,
  backHref,
  backLabel = "Exit singing mode",
}: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f1724] text-[#f4f1ea]">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-5 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <Link
            href={backHref}
            className="text-sm text-[#aeb8c9] transition hover:text-white"
          >
            ← {backLabel}
          </Link>
        </div>

        <h1 className="font-display text-center text-3xl font-semibold leading-tight sm:text-5xl">
          {current.title}
        </h1>

        <div className="mt-10 flex-1">
          <LyricsView
            roman={current.roman_lyrics}
            translation={current.translation}
            devanagari={current.devanagari_lyrics}
            large
            dark
            showTranslationDefault={false}
          />
        </div>

        <nav
          aria-label="Previous and next bhajan"
          className="mt-10 flex items-stretch justify-between gap-3 border-t border-white/10 pt-5 pb-4"
        >
          {prev ? (
            <Link
              href={prev.href}
              className="flex min-w-0 flex-1 items-center gap-2 border border-white/15 px-3 py-3 text-left transition hover:bg-white/5"
            >
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs tracking-[0.12em] text-[#aeb8c9] uppercase">
                  Previous
                </span>
                <span className="block truncate text-sm">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link
              href={next.href}
              className="flex min-w-0 flex-1 items-center justify-end gap-2 border border-white/15 px-3 py-3 text-right transition hover:bg-white/5"
            >
              <span className="min-w-0">
                <span className="block text-xs tracking-[0.12em] text-[#aeb8c9] uppercase">
                  Next
                </span>
                <span className="block truncate text-sm">{next.title}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </div>
    </div>
  );
}
