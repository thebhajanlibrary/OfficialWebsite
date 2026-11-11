import { NextResponse } from "next/server";
import { searchChutney, searchWedding } from "@/lib/chutney";
import { searchFolders } from "@/lib/folders";
import { getArtists, searchBhajans } from "@/lib/queries";
import { matchesSearchQuery } from "@/lib/search-match";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [], artists: [] });
  }

  try {
    const [matches, chutneyMatches, weddingMatches, artists] =
      await Promise.all([
        searchBhajans(q),
        Promise.resolve(searchChutney(q)),
        Promise.resolve(searchWedding(q)),
        getArtists(),
      ]);

    const folderResults = searchFolders(q).slice(0, 3).map((folder) => ({
      id: `folder-${folder.slug}`,
      title: folder.title,
      slug: folder.slug,
      href: `/folders/${folder.slug}`,
      alternate_title: folder.search_aliases?.[0] ?? null,
      artist_version: null,
      section: "Folder" as const,
    }));

    const bhajanResults = matches.slice(0, 8).map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      href: `/bhajans/${b.slug}`,
      alternate_title: b.alternate_title,
      artist_version: b.artist_version,
      section: "Bhajan" as const,
    }));

    const seen = new Set<string>();
    const folkResults: {
      id: string;
      title: string;
      slug: string;
      href: string;
      alternate_title: string | null;
      artist_version: string | null;
      section: string;
    }[] = [];

    for (const s of chutneyMatches) {
      seen.add(s.slug);
      const alsoWedding = (s.sections ?? []).includes("wedding");
      folkResults.push({
        id: `chutney-${s.slug}`,
        title: s.title,
        slug: s.slug,
        href: `/chutney/${s.slug}`,
        alternate_title: s.cue ?? null,
        artist_version: s.artist ?? null,
        section: alsoWedding
          ? "Traditional Chutney · Wedding"
          : "Traditional Chutney",
      });
    }

    for (const s of weddingMatches) {
      if (seen.has(s.slug)) continue;
      folkResults.push({
        id: `wedding-${s.slug}`,
        title: s.title,
        slug: s.slug,
        href: `/wedding/${s.slug}`,
        alternate_title: s.cue ?? null,
        artist_version: s.artist ?? null,
        section: "Wedding Songs",
      });
    }

    const results = [
      ...bhajanResults,
      ...folderResults,
      ...folkResults.slice(0, 4),
    ].slice(0, 10);

    const artistResults = artists
      .filter(
        (a) =>
          matchesSearchQuery(a.name, q) ||
          (a.bio ? matchesSearchQuery(a.bio, q) : false)
      )
      .slice(0, 4)
      .map((a) => ({
        name: a.name,
        slug: a.slug,
        bhajanCount: a.bhajanCount,
      }));

    return NextResponse.json({ results, artists: artistResults });
  } catch {
    return NextResponse.json({ results: [], artists: [] }, { status: 500 });
  }
}
