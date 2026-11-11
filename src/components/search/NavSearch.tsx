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
} from "react";
import { Search, X, Loader2 } from "lucide-react";

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

export function NavSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [artistSuggestions, setArtistSuggestions] = useState<ArtistSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setArtistSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as {
          results?: Suggestion[];
          artists?: ArtistSuggestion[];
        };
        setSuggestions(data.results ?? []);
        setArtistSuggestions(data.artists ?? []);
        setOpen(true);
        setActive(-1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setSuggestions([]);
          setArtistSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        if (!query.trim()) {
          setExpanded(false);
        }
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [query]);

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
    if (e.key === "Escape") {
      setOpen(false);
      if (!query.trim()) setExpanded(false);
      return;
    }

    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  }

  function handleOpenExpand() {
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    setArtistSuggestions([]);
    setOpen(false);
    setExpanded(false);
  }

  return (
    <div ref={rootRef} className="relative flex items-center">
      {!expanded ? (
        <button
          type="button"
          onClick={handleOpenExpand}
          className="flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-surface/70 px-3 text-xs font-medium text-muted transition hover:border-accent/60 hover:bg-surface hover:text-foreground"
          aria-label="Search bhajans and songs"
          title="Search"
        >
          <Search className="h-3.5 w-3.5 text-accent" />
          <span className="hidden xl:inline">Search library…</span>
        </button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="relative flex items-center"
          role="search"
        >
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-accent" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0 || artistSuggestions.length > 0) {
                  setOpen(true);
                }
              }}
              onKeyDown={onKeyDown}
              placeholder="Search bhajans, chutney, lyrics…"
              className="w-48 rounded-xl border border-accent/60 bg-surface py-1.5 pl-8 pr-7 text-xs text-foreground shadow-sm focus:border-accent focus:outline-none sm:w-64 md:w-72"
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls={listId}
              aria-expanded={open}
            />
            {loading ? (
              <Loader2 className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 animate-spin text-muted" />
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 text-muted hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>
      )}

      {open && query.trim() && (
        <div
          id={listId}
          role="listbox"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] max-h-[min(26rem,75vh)] w-80 overflow-y-auto rounded-2xl border border-border bg-surface p-1 shadow-2xl sm:w-96"
        >
          {loading &&
          suggestions.length === 0 &&
          artistSuggestions.length === 0 ? (
            <p className="px-4 py-3 text-xs text-muted">Searching…</p>
          ) : suggestions.length === 0 && artistSuggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-muted">
              No matching songs or artists found.
            </div>
          ) : (
            <>
              {suggestions.length > 0 && (
                <div className={artistSuggestions.length > 0 ? "border-b border-border/70 pb-1" : "pt-1"}>
                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Songs
                  </p>
                  <ul>
                    {suggestions.map((item, index) => (
                      <li key={item.id} role="option" aria-selected={index === active}>
                        <Link
                          href={item.href ?? `/bhajans/${item.slug}`}
                          className={`block rounded-xl px-3 py-2 text-xs transition ${
                            index === active
                              ? "bg-accent-soft"
                              : "hover:bg-accent-soft/70"
                          }`}
                          onClick={() => {
                            setOpen(false);
                            setExpanded(false);
                          }}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-primary truncate">
                              {item.title}
                            </span>
                            {item.section && (
                              <span className="shrink-0 rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase text-muted">
                                {item.section}
                              </span>
                            )}
                          </div>
                          {item.artist_version && (
                            <span className="mt-0.5 block text-[11px] text-muted truncate">
                              {item.artist_version}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {artistSuggestions.length > 0 && (
                <div className="pt-1">
                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Artists
                  </p>
                  <ul>
                    {artistSuggestions.map((artist) => (
                      <li key={artist.slug}>
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="block rounded-xl px-3 py-2 text-xs transition hover:bg-accent-soft/70"
                          onClick={() => {
                            setOpen(false);
                            setExpanded(false);
                          }}
                        >
                          <span className="font-semibold text-primary">
                            {artist.name}
                          </span>
                          <span className="ml-2 text-[10px] text-muted">
                            ({artist.bhajanCount} songs)
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-border/70 p-1.5 text-center">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  className="block rounded-lg py-1.5 text-xs font-semibold text-accent transition hover:bg-accent-soft"
                  onClick={() => {
                    setOpen(false);
                    setExpanded(false);
                  }}
                >
                  View all results for &ldquo;{query.trim()}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
