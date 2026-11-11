import type { Metadata } from "next";
import Link from "next/link";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { SearchBar } from "@/components/search/SearchBar";
import { searchChutney, searchWedding, chutneyListingCredit } from "@/lib/chutney";
import { searchFolders } from "@/lib/folders";
import { searchBhajans } from "@/lib/queries";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const bhajanResults = query ? await searchBhajans(query) : [];
  const folderResults = query ? searchFolders(query) : [];
  const chutneyResults = query ? searchChutney(query) : [];
  const weddingResults = query ? searchWedding(query) : [];
  // Avoid listing the same dual-section song twice under Wedding if already in Chutney
  const chutneySlugs = new Set(chutneyResults.map((s) => s.slug));
  const weddingOnly = weddingResults.filter((s) => !chutneySlugs.has(s.slug));
  const dualWedding = weddingResults.filter((s) => chutneySlugs.has(s.slug));
  const total =
    bhajanResults.length +
    folderResults.length +
    chutneyResults.length +
    weddingOnly.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Search
        </h1>
        <p className="mt-1 text-muted">
          Title, lyrics, category, Traditional Chutney, or Wedding songs.
        </p>
      </div>
      <SearchBar initialQuery={q} large autofocus syncUrl />
      {query ? (
        <div className="space-y-8">
          <p className="text-sm text-muted">
            {total} result{total === 1 ? "" : "s"} for “{query}”
          </p>

          {folderResults.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-primary">
                Folders
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {folderResults.map((folder) => (
                  <li key={folder.slug}>
                    <Link
                      href={`/folders/${folder.slug}`}
                      className="flex flex-col gap-0.5 py-3.5 transition hover:bg-surface-muted/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-2"
                    >
                      <span className="font-medium text-primary">
                        {folder.title}
                      </span>
                      <span className="shrink-0 text-sm text-muted">
                        Folder
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {bhajanResults.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-primary">
                Bhajans
              </h2>
              <BhajanList
                bhajans={bhajanResults}
                emptyMessage="No bhajan matches."
              />
            </section>
          )}

          {chutneyResults.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-primary">
                Traditional Chutney
                {dualWedding.length > 0 ? " · Wedding" : ""}
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {chutneyResults.map((song) => (
                  <li key={song.slug}>
                    <Link
                      href={`/chutney/${song.slug}`}
                      className="flex items-center gap-3 py-3.5 transition hover:bg-surface-muted/60 sm:gap-4 sm:px-2"
                    >
                      {song.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={song.thumbnail_url}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded object-cover"
                        />
                      ) : null}
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <span className="font-medium text-primary">
                          {song.title}
                        </span>
                        <span className="shrink-0 text-sm text-muted">
                          {chutneyListingCredit(song, "Traditional Chutney")}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {weddingOnly.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-primary">
                Wedding Songs
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {weddingOnly.map((song) => (
                  <li key={song.slug}>
                    <Link
                      href={`/wedding/${song.slug}`}
                      className="flex flex-col gap-0.5 py-3.5 transition hover:bg-surface-muted/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-2"
                    >
                      <span className="font-medium text-primary">
                        {song.title}
                      </span>
                      <span className="shrink-0 text-sm text-muted">
                        {chutneyListingCredit(song, "Wedding")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {total === 0 && (
            <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
              No matches. Try another word or category name.
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted">Type a word above to search the library.</p>
      )}
    </div>
  );
}
