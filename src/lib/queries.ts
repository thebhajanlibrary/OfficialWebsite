import { createClient } from "@/lib/supabase/server";
import {
  ARTIST_PROFILES,
  artistSlug,
  creditedArtistNames,
  getArtistProfile,
} from "@/lib/artists";
import { BHAJAN_CONTENT, type BhajanContent } from "@/lib/bhajan-content";
import { scoreSearchMatch } from "@/lib/search-match";
import { assetUrl } from "@/lib/asset-url";
import {
  getLocalCategories,
  getLocalCategoryBySlug,
} from "@/lib/categories";
import {
  HYMN_FOLDERS,
  bhajanBelongsToFolder,
  folderForBhajan,
  getFolder,
  isLibraryQueueSkipTrack,
  type HymnFolder,
} from "@/lib/folders";
import { ALBUMS, getAlbum, indexedArtistNameForBhajan, isOmittedFromLibrary, type Album } from "@/lib/albums";
import { folkQueueTracks, getWeddingSongs } from "@/lib/chutney";
import { getFestivalById } from "@/lib/festivals";
import {
  buildQueueTrack,
  type PlayQueueRef,
  type QueueTrack,
} from "@/lib/play-queue";

import type {
  Bhajan,
  BhajanWithCategories,
  Category,
  CategoryType,
  Playlist,
  PlaylistWithItems,
} from "@/lib/types";

type BhajanRow = Bhajan & {
  bhajan_categories?: { categories: Category | null }[] | null;
};

const SUPABASE_QUERY_MS = 800;

async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number = SUPABASE_QUERY_MS
): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function isDynamicServerError(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).includes("DYNAMIC")
  );
}

function mapBhajan(
  row: BhajanRow,
  categoryIndex?: Map<string, Category>
): BhajanWithCategories {
  const categories =
    row.bhajan_categories
      ?.map((link) => link.categories)
      .filter((c): c is Category => Boolean(c)) ?? [];

  const { bhajan_categories: _ignored, ...bhajan } = row;
  const content = BHAJAN_CONTENT[bhajan.slug];

  const resolvedCategories =
    categories.length > 0
      ? categories
      : resolveContentCategories(content, categoryIndex);

  if (!content) {
    return {
      ...bhajan,
      categories: resolvedCategories,
      thumbnail_url: null,
      cover_url: null,
      mini_cover_url: null,
      youtube_url: null,
      video_url: null,
      video_poster_url: null,
      video_credit: null,
    };
  }

  return {
    ...bhajan,
    title: content.title ?? bhajan.title,
    alternate_title: content.alternate_title ?? bhajan.alternate_title,
    audio_url: content.audio_url ?? bhajan.audio_url,
    artist_version: content.artist_version ?? bhajan.artist_version,
    roman_lyrics: content.roman_lyrics ?? bhajan.roman_lyrics,
    devanagari_lyrics: content.devanagari_lyrics ?? bhajan.devanagari_lyrics,
    translation: content.translation ?? bhajan.translation,
    meaning: content.meaning ?? bhajan.meaning,
    display_order: content.display_order ?? bhajan.display_order,
    thumbnail_url: assetUrl(content.thumbnail_url ?? null),
    cover_url: assetUrl(content.cover_url ?? null),
    mini_cover_url: assetUrl(content.mini_cover_url ?? null),
    youtube_url: content.youtube_url ?? null,
    video_url: assetUrl(content.video_url ?? null),
    video_poster_url: assetUrl(content.video_poster_url ?? null),
    video_credit: content.video_credit ?? null,
    player_cover_aspect: content.player_cover_aspect ?? undefined,
    categories: resolvedCategories,
  };
}

function resolveContentCategories(
  content: BhajanContent | undefined,
  categoryIndex?: Map<string, Category>
): Category[] {
  if (!content?.category_slugs?.length || !categoryIndex) return [];
  return content.category_slugs
    .map((slug) => categoryIndex.get(slug))
    .filter((c): c is Category => Boolean(c));
}

function categoryIndexFrom(list: Category[]): Map<string, Category> {
  return new Map(list.map((c) => [c.slug, c]));
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function localBhajanFromContent(
  slug: string,
  content: BhajanContent,
  categoryIndex?: Map<string, Category>
): BhajanWithCategories | null {
  // Party mixes / instrumentals may ship without lyrics — still list them
  // when there is local audio, video, or a YouTube link.
  if (
    !content.roman_lyrics &&
    !content.audio_url &&
    !content.youtube_url &&
    !content.video_url
  ) {
    return null;
  }
  const title =
    content.title?.trim() ||
    content.alternate_title?.split("·")[0]?.trim() ||
    titleFromSlug(slug);
  const now = new Date().toISOString();
  return {
    id: `local-${slug}`,
    slug,
    title,
    alternate_title: content.alternate_title ?? null,
    artist_version: content.artist_version ?? null,
    roman_lyrics: content.roman_lyrics ?? "",
    devanagari_lyrics: content.devanagari_lyrics ?? null,
    translation: content.translation ?? null,
    meaning: content.meaning ?? null,
    audio_url: content.audio_url ?? null,
    pdf_url: null,
    display_order: content.display_order ?? null,
    created_at: now,
    updated_at: now,
    thumbnail_url: assetUrl(content.thumbnail_url ?? null),
    cover_url: assetUrl(content.cover_url ?? null),
    mini_cover_url: assetUrl(content.mini_cover_url ?? null),
    youtube_url: content.youtube_url ?? null,
    video_url: assetUrl(content.video_url ?? null),
    video_poster_url: assetUrl(content.video_poster_url ?? null),
    video_credit: content.video_credit ?? null,
    player_cover_aspect: content.player_cover_aspect ?? undefined,
    categories: resolveContentCategories(content, categoryIndex),
  };
}

function mergeLocalBhajans(
  existing: BhajanWithCategories[],
  categoryIndex?: Map<string, Category>
): BhajanWithCategories[] {
  const slugs = new Set(existing.map((b) => b.slug));
  const extras: BhajanWithCategories[] = [];

  for (const [slug, content] of Object.entries(BHAJAN_CONTENT)) {
    if (slugs.has(slug)) continue;
    const local = localBhajanFromContent(slug, content, categoryIndex);
    if (local) extras.push(local);
  }

  return [...existing, ...extras].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
}

const bhajanSelect = `
  *,
  bhajan_categories (
    categories (*)
  )
`;

export async function getBhajans(): Promise<BhajanWithCategories[]> {
  try {
    const supabase = await createClient();
    const [bhajansResult, categories] = await Promise.all([
      withTimeout(
        supabase
          .from("bhajans")
          .select(bhajanSelect)
          .order("title", { ascending: true })
      ),
      getCategories().catch(() => [] as Category[]),
    ]);

    // Keep local-only content available even when Supabase is slow/unavailable.
    if (!bhajansResult || bhajansResult.error) {
      const index = categoryIndexFrom(categories);
      return mergeLocalBhajans([], index);
    }

    const index = categoryIndexFrom(categories);
    return mergeLocalBhajans(
      ((bhajansResult.data ?? []) as BhajanRow[]).map((row) =>
        mapBhajan(row, index)
      ),
      index
    );
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getBhajans:", err);
    return mergeLocalBhajans([], categoryIndexFrom(getLocalCategories()));
  }
}

export async function getFestivalBhajans(
  festivalId: string
): Promise<BhajanWithCategories[]> {
  const fest = getFestivalById(festivalId);
  if (!fest) return [];

  const all = await getBhajans();
  const bySlug = new Map(all.map((b) => [b.slug, b]));

  const result: BhajanWithCategories[] = [];
  const seen = new Set<string>();

  // 1. First add strictly curated featured song slugs
  for (const slug of fest.featuredSongSlugs) {
    const b = bySlug.get(slug);
    if (b && !seen.has(b.slug)) {
      seen.add(b.slug);
      result.push(b);
    }
  }

  // 2. Add songs tagged with the specific festival category (e.g. 'raksha-bandhan', 'janmashtami', etc.)
  if (fest.categorySlug) {
    for (const b of all) {
      if (seen.has(b.slug) || isLibraryQueueSkipTrack(b.slug) || isOmittedFromLibrary(b.slug)) {
        continue;
      }
      const matchesCategory = b.categories.some((c) => c.slug === fest.categorySlug);
      if (matchesCategory) {
        seen.add(b.slug);
        result.push(b);
      }
    }
  }

  if (fest.id === "navratri") {
    for (const slug of getFolder("garba")?.member_slugs ?? []) {
      const b = bySlug.get(slug);
      if (b && !seen.has(b.slug)) {
        seen.add(b.slug);
        result.push(b);
      }
    }
  }

  return result;
}

export async function getBhajanBySlug(
  slug: string
): Promise<BhajanWithCategories | null> {
  try {
    const supabase = await createClient();
    const [rowResult, categories] = await Promise.all([
      withTimeout(
        supabase.from("bhajans").select(bhajanSelect).eq("slug", slug).maybeSingle()
      ),
      getCategories().catch(() => [] as Category[]),
    ]);

    const index = categoryIndexFrom(categories);
    if (rowResult && !rowResult.error && rowResult.data) {
      return mapBhajan(rowResult.data as BhajanRow, index);
    }

    const content = BHAJAN_CONTENT[slug];
    return content ? localBhajanFromContent(slug, content, index) : null;
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getBhajanBySlug:", err);
    const content = BHAJAN_CONTENT[slug];
    return content
      ? localBhajanFromContent(
          slug,
          content,
          categoryIndexFrom(getLocalCategories())
        )
      : null;
  }
}

export async function getBhajanById(
  id: string
): Promise<BhajanWithCategories | null> {
  try {
    const supabase = await createClient();
    const [{ data, error }, categories] = await Promise.all([
      supabase.from("bhajans").select(bhajanSelect).eq("id", id).maybeSingle(),
      getCategories(),
    ]);

    if (error) throw error;
    return data ? mapBhajan(data as BhajanRow, categoryIndexFrom(categories)) : null;
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getBhajanById:", err);
    return null;
  }
}

export async function getCategories(
  type?: CategoryType
): Promise<Category[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("categories").select("*").order("name");
    if (type) query = query.eq("type", type);

    const result = await withTimeout(query);
    if (result && !result.error && (result.data?.length ?? 0) > 0) {
      const remote = result.data as Category[];
      const local = getLocalCategories(type);
      const seen = new Set(remote.map((c) => `${c.type}:${c.slug}`));
      const extras = local.filter((c) => !seen.has(`${c.type}:${c.slug}`));
      return [...remote, ...extras].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    if (result?.error) console.error("getCategories:", result.error.message);
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getCategories:", err);
  }
  return getLocalCategories(type);
}

export async function getCategoryBySlug(
  type: CategoryType,
  slug: string
): Promise<Category | null> {
  try {
    const supabase = await createClient();
    const result = await withTimeout(
      supabase
        .from("categories")
        .select("*")
        .eq("type", type)
        .eq("slug", slug)
        .maybeSingle()
    );

    if (result && !result.error && result.data) {
      return result.data as Category;
    }
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getCategoryBySlug:", err);
  }
  return getLocalCategoryBySlug(type, slug);
}

export async function getBhajansByCategory(
  categoryId: string
): Promise<BhajanWithCategories[]> {
  // Use the full library (including local content) so category pages
  // include bhajans that only exist in BHAJAN_CONTENT.
  const all = await getBhajans();
  return all
    .filter((b) => !isOmittedFromLibrary(b.slug))
    .filter((b) =>
      b.categories.some(
        (c) => c.id === categoryId || `local-${c.type}-${c.slug}` === categoryId
      )
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function searchBhajans(
  query: string
): Promise<BhajanWithCategories[]> {
  const q = query.trim();
  if (!q) return [];

  // Search mapped bhajans so local content overrides (artist, lyrics, etc.) are included.
  const all = await getBhajans();
  return all
    .filter((b) => !isOmittedFromLibrary(b.slug))
    .map((b) => {
      const folder = folderForBhajan(b);
      const score = scoreSearchMatch(
        {
          title: b.title,
          alternate_title: b.alternate_title,
          artist_version: b.artist_version,
          roman_lyrics: b.roman_lyrics,
          devanagari_lyrics: b.devanagari_lyrics,
          translation: b.translation,
          meaning: b.meaning,
          slug: b.slug,
          categories: [
            ...b.categories.map((c) => c.name),
            folder?.title,
            folder?.description,
            ...(folder?.search_aliases ?? []),
          ].filter(Boolean) as string[],
        },
        q
      );
      return score > 0 ? { b, score } : null;
    })
    .filter((row): row is { b: BhajanWithCategories; score: number } => row !== null)
    .sort(
      (a, b) =>
        b.score - a.score || a.b.title.localeCompare(b.b.title)
    )
    .map(({ b }) => b);
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Playlist[];
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getPlaylists:", err);
    return [];
  }
}

export async function getPlaylistById(
  id: string
): Promise<PlaylistWithItems | null> {
  try {
    const supabase = await createClient();
    const { data: playlist, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!playlist) return null;

    const { data: items, error: itemsError } = await supabase
      .from("playlist_items")
      .select("*, bhajan:bhajans(*)")
      .eq("playlist_id", id)
      .order("position", { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...(playlist as Playlist),
      items: (items ?? []) as PlaylistWithItems["items"],
    };
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.error("getPlaylistById:", err);
    return null;
  }
}

export async function getAdjacentBhajans(slug: string): Promise<{
  prev: Bhajan | null;
  next: Bhajan | null;
  current: BhajanWithCategories | null;
}> {
  const all = await getBhajans();
  const index = all.findIndex((b) => b.slug === slug);
  if (index === -1) {
    // Direct local/DB lookup so a miss in the merged list (e.g. cold
    // Turbopack compile of bhajan-content) does not 404 a valid slug.
    const current = await getBhajanBySlug(slug);
    return { prev: null, next: null, current };
  }

  return {
    current: all[index],
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export type ArtistSummary = {
  name: string;
  slug: string;
  bio: string | null;
  about: string[] | null;
  notes: {
    title: string;
    body: string;
    address?: string;
    href?: string;
    linkLabel?: string;
  }[] | null;
  photo_url: string | null;
  photo_fit: "cover" | "contain" | "fill";
  bhajanCount: number;
  live_clips: {
    title: string;
    youtube_url?: string;
    video_url?: string;
    poster_url?: string;
  }[] | null;
};

export async function getArtists(): Promise<ArtistSummary[]> {
  const all = await getBhajans();
  const map = new Map<string, ArtistSummary>();

  for (const bhajan of all) {
    const indexed = indexedArtistNameForBhajan(
      bhajan.slug,
      bhajan.artist_version
    );
    for (const name of creditedArtistNames(indexed)) {
      const slug = artistSlug(name);
      const existing = map.get(slug);
      if (existing) {
        existing.bhajanCount += 1;
      } else {
        const profile = getArtistProfile(slug);
        map.set(slug, {
          name: profile?.name ?? name,
          slug,
          bio: profile?.bio ?? null,
          about: profile?.about ?? null,
          notes: profile?.notes ?? null,
          photo_url: profile?.photo_url ?? null,
          photo_fit: profile?.photo_fit ?? "cover",
          bhajanCount: 1,
          live_clips: profile?.live_clips ?? null,
        });
      }
    }
  }

  // Include known profiles even if somehow unmatched
  for (const [slug, profile] of Object.entries(ARTIST_PROFILES)) {
    if (!map.has(slug)) {
      map.set(slug, {
        name: profile.name,
        slug,
        bio: profile.bio,
        about: profile.about ?? null,
        notes: profile.notes ?? null,
        photo_url: profile.photo_url ?? null,
        photo_fit: profile.photo_fit ?? "cover",
        bhajanCount: 0,
        live_clips: profile.live_clips ?? null,
      });
    }
  }

  return Array.from(map.values())
    .filter((a) => a.bhajanCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getArtistBySlug(slug: string): Promise<{
  artist: ArtistSummary;
  bhajans: BhajanWithCategories[];
} | null> {
  const all = await getBhajans();
  const profile = getArtistProfile(slug);
  const canonicalSlug = profile ? artistSlug(profile.name) : slug;
  const bhajans = all.filter((b) => {
    const indexed = indexedArtistNameForBhajan(b.slug, b.artist_version);
    return creditedArtistNames(indexed).some((n) => {
      const ns = artistSlug(n);
      return ns === slug || ns === canonicalSlug;
    });
  });

  if (bhajans.length === 0) {
    if (!profile) return null;
    return {
      artist: {
        name: profile.name,
        slug: canonicalSlug,
        bio: profile.bio,
        about: profile.about ?? null,
        notes: profile.notes ?? null,
        photo_url: profile.photo_url ?? null,
        photo_fit: profile.photo_fit ?? "cover",
        bhajanCount: 0,
        live_clips: profile.live_clips ?? null,
      },
      bhajans: [],
    };
  }

  const name =
    profile?.name ??
    creditedArtistNames(
      indexedArtistNameForBhajan(bhajans[0].slug, bhajans[0].artist_version)
    ).find((n) => {
      const ns = artistSlug(n);
      return ns === slug || ns === canonicalSlug;
    }) ??
    slug;

  return {
    artist: {
      name,
      slug: canonicalSlug,
      bio: profile?.bio ?? null,
      about: profile?.about ?? null,
      notes: profile?.notes ?? null,
      photo_url: profile?.photo_url ?? null,
      photo_fit: profile?.photo_fit ?? "cover",
      bhajanCount: bhajans.length,
      live_clips: profile?.live_clips ?? null,
    },
    bhajans,
  };
}

export async function getFolders(): Promise<
  { folder: HymnFolder; count: number }[]
> {
  const all = await getBhajans();
  return HYMN_FOLDERS.filter((folder) => !folder.omit_from_library).map((folder) => ({
    folder,
    count:
      folder.slug === "wedding"
        ? getWeddingSongs().length
        : all.filter((b) => bhajanBelongsToFolder(folder.slug, b)).length,
  })).sort((a, b) =>
    a.folder.title.localeCompare(b.folder.title, undefined, {
      sensitivity: "base",
    })
  );
}

export async function getFolderWithBhajans(slug: string): Promise<{
  folder: HymnFolder;
  bhajans: BhajanWithCategories[];
} | null> {
  const folder = getFolder(slug);
  if (!folder) return null;

  const all = await getBhajans();
  const bhajans = all.filter((b) => bhajanBelongsToFolder(folder.slug, b));

  if (folder.member_slugs?.length) {
    const order = new Map(folder.member_slugs.map((s, i) => [s, i]));
    bhajans.sort(
      (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999)
    );
  } else {
    bhajans.sort((a, b) => {
      const aa = (a.artist_version ?? "").localeCompare(b.artist_version ?? "");
      if (aa !== 0) return aa;
      return a.title.localeCompare(b.title);
    });
  }

  return { folder, bhajans };
}

export async function getAlbums(): Promise<
  { album: Album; count: number; tracks: BhajanWithCategories[] }[]
> {
  const all = await getBhajans();
  const bySlug = new Map(all.map((b) => [b.slug, b]));
  return ALBUMS.map((album) => {
    const tracks = album.track_slugs
      .map((s) => bySlug.get(s))
      .filter((b): b is BhajanWithCategories => Boolean(b));
    return { album, count: tracks.length, tracks };
  }).sort((a, b) =>
    a.album.title.localeCompare(b.album.title, undefined, {
      sensitivity: "base",
    })
  );
}

export async function getAlbumWithTracks(slug: string): Promise<{
  album: Album;
  tracks: BhajanWithCategories[];
} | null> {
  const album = getAlbum(slug);
  if (!album) return null;

  const all = await getBhajans();
  const bySlug = new Map(all.map((b) => [b.slug, b]));
  const tracks = album.track_slugs
    .map((s) => bySlug.get(s))
    .filter((b): b is BhajanWithCategories => Boolean(b));

  return { album, tracks };
}

/** Ordered slug list for continuous play (album / folder / artist / playlist / …). */
export async function resolvePlayQueueSlugs(
  queue: PlayQueueRef
): Promise<string[]> {
  if (queue.kind === "album") {
    const data = await getAlbumWithTracks(queue.id);
    return data?.tracks.map((t) => t.slug) ?? [];
  }
  if (queue.kind === "folder") {
    if (queue.id === "wedding") {
      return getWeddingSongs().map((s) => s.slug);
    }
    const data = await getFolderWithBhajans(queue.id);
    return data?.bhajans.map((b) => b.slug) ?? [];
  }
  if (queue.kind === "playlist") {
    const data = await getPlaylistById(queue.id);
    return data?.items.map((item) => item.bhajan.slug) ?? [];
  }
  if (queue.kind === "category") {
    const bhajans = await getBhajansByCategory(queue.id);
    return bhajans
      .filter((b) => !isLibraryQueueSkipTrack(b.slug) && !isOmittedFromLibrary(b.slug))
      .map((b) => b.slug);
  }
  if (queue.kind === "festival") {
    const bhajans = await getFestivalBhajans(queue.id);
    return bhajans.map((b) => b.slug);
  }
  if (queue.kind === "library") {
    const bhajans = await getBhajans();
    return bhajans
      .filter((b) => !isLibraryQueueSkipTrack(b.slug) && !isOmittedFromLibrary(b.slug))
      .map((b) => b.slug);
  }
  const data = await getArtistBySlug(queue.id);
  return data?.bhajans.map((b) => b.slug) ?? [];
}

/** Full track payloads for continuous play (audio / YouTube / site video). */
export async function resolvePlayQueueTracks(
  queue: PlayQueueRef
): Promise<QueueTrack[]> {
  if (queue.kind === "folder" && queue.id === "wedding") {
    return folkQueueTracks("wedding");
  }

  const slugs = await resolvePlayQueueSlugs(queue);
  if (slugs.length === 0) return [];

  const all = await getBhajans();
  const bySlug = new Map(all.map((b) => [b.slug, b]));

  return slugs.map((slug) => {
    const b = bySlug.get(slug);
    const cover = b?.cover_url ?? b?.thumbnail_url ?? null;
    const miniCover = b?.mini_cover_url ?? b?.thumbnail_url ?? cover;
    return buildQueueTrack({
      slug,
      title: b?.title ?? slug,
      artist: creditedArtistNames(b?.artist_version).join(" · ") || null,
      audioUrl: b?.audio_url ?? null,
      cover,
      miniCover,
      coverAspect: b?.player_cover_aspect,
      queue,
      autoplay: true,
    });
  });
}

export function neighborsInQueue(
  slugs: string[],
  currentSlug: string
): { prevSlug: string | null; nextSlug: string | null; index: number } {
  const index = slugs.indexOf(currentSlug);
  if (index < 0) {
    return { prevSlug: null, nextSlug: null, index: -1 };
  }
  return {
    index,
    prevSlug: index > 0 ? (slugs[index - 1] ?? null) : null,
    nextSlug: index < slugs.length - 1 ? (slugs[index + 1] ?? null) : null,
  };
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
