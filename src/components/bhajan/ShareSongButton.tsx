"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type Props = {
  path: string;
  title: string;
  /** Labeled button for a song page. Icon for a list row. */
  variant?: "icon" | "button";
  /** Smaller icon for a tight track list. */
  size?: "sm" | "md";
};

export function ShareSongButton({
  path,
  title,
  variant = "icon",
  size = "md",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function share(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const url = new URL(path, window.location.origin).toString();
    const payload = {
      title: `${title} · Bhajan Library`,
      text: title,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  const label = copied ? `Copied link to ${title}` : `Share ${title}`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={share}
        className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm"
        aria-label={label}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden />
        )}
        {copied ? "Copied" : "Share"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:border-accent hover:text-primary ${size === "sm" ? "h-7 w-7" : "h-9 w-9"}`}
      aria-label={label}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
