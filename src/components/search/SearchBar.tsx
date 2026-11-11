"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
  startTransition,
} from "react";
import { Search } from "lucide-react";

type Suggestion = {
  id: string;
  title: string;
  slug: string;
  href?: string;
  alternate_title: string | null;
  artist_version: string | null;
  section?: string;
};

type ArtistSuggestion = {
  name: string;
  slug: string;
  bhajanCount: number;
};

type Props = {
  initialQuery?: string;
  large?: boolean;
  autofocus?: boolean;
  /** Keep /search?q= in sync while typing */
  syncUrl?: boolean;
};

export function SearchBar({
  initialQuery = "",
  large = false,
  autofocus = false,
  syncUrl = false,
}: Props) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [artistSuggestions, setArtistSuggestions] = useState<
    ArtistSuggestion[]
  >([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setArtistSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setSuggestions([]);
          setArtistSuggestions([]);
          setOpen(false);
          return;
        }
        const data = (await res.json()) as {
          results?: Suggestion[];
          artists?: ArtistSuggestion[];
        };
        setSuggestions(data.results ?? []);
        setArtistSuggestions(data.artists ?? []);
        setOpen(true);
        setActive(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSuggestions([]);
          setArtistSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 160);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!syncUrl) return;
    const q = query.trim();
    const timer = window.setTimeout(() => {
      const href = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
      startTransition(() => {
        router.replace(href);
      });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, syncUrl, router]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    if (active >= 0 && suggestions[active]) {
      const hit = suggestions[active];
      router.push(hit.href ?? `/bhajans/${hit.slug}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full" role="search">
      <label htmlFor="bhajan-search" className="sr-only">
        Search bhajans
      </label>
      <div ref={rootRef} className="relative">
        <Search
          className={`pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted ${
            large ? "h-5 w-5" : "h-4 w-4"
          }`}
          aria-hidden
        />
        <input
          id="bhajan-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          autoFocus={autofocus}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          placeholder="Search title, lyrics, artist, category…"
          className={`w-full border border-border bg-surface text-foreground shadow-[0_12px_40px_rgba(21,34,56,0.06)] placeholder:text-muted transition focus:border-primary focus:shadow-[0_16px_48px_rgba(21,34,56,0.1)] ${
            large
              ? "rounded-xl py-4 pl-12 pr-4 text-base sm:text-lg"
              : "rounded-lg py-3 pl-11 pr-4 text-sm sm:text-base"
          }`}
        />

        {open && query.trim() && (
          <div
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-[60] max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-border bg-surface text-left shadow-[0_20px_50px_rgba(21,34,56,0.18)]"
          >
            {loading &&
            suggestions.length === 0 &&
            artistSuggestions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">Searching…</p>
            ) : suggestions.length === 0 && artistSuggestions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">No matches</p>
            ) : (
              <>
                {suggestions.length > 0 && (
                  <div className={artistSuggestions.length > 0 ? "border-b border-border" : ""}>
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                      Songs
                    </p>
                    <ul>
                      {suggestions.map((item, index) => (
                        <li
                          key={item.id}
                          role="option"
                          aria-selected={index === active}
                        >
                          <Link
                            href={item.href ?? `/bhajans/${item.slug}`}
                            className={`block px-4 py-3 transition ${
                              index === active
                                ? "bg-accent-soft"
                                : "hover:bg-accent-soft/70"
                            }`}
                            onClick={() => setOpen(false)}
                            onMouseEnter={() => setActive(index)}
                          >
                            <span className="font-display text-lg font-semibold leading-snug text-primary break-words">
                              {item.title}
                            </span>
                            {(item.section ||
                              item.artist_version ||
                              item.alternate_title) && (
                              <span className="mt-1 block text-sm leading-snug text-muted break-words">
                                {[
                                  item.section === "Bhajan"
                                    ? null
                                    : item.section,
                                  item.artist_version,
                                  item.alternate_title,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {artistSuggestions.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                      Artists
                    </p>
                    <ul>
                      {artistSuggestions.map((artist) => (
                        <li key={artist.slug}>
                          <Link
                            href={`/artists/${artist.slug}`}
                            className="block px-4 py-3 transition hover:bg-accent-soft/70"
                            onClick={() => setOpen(false)}
                          >
                            <span className="font-display text-lg font-semibold leading-snug text-primary break-words">
                              {artist.name}
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              {artist.bhajanCount} bhajan
                              {artist.bhajanCount === 1 ? "" : "s"}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            {(suggestions.length > 0 || artistSuggestions.length > 0) && (
              <button
                type="submit"
                className="sticky bottom-0 w-full border-t border-border bg-surface px-4 py-2.5 text-left text-sm font-medium text-accent hover:bg-surface-muted"
              >
                See all results for “{query.trim()}”
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
