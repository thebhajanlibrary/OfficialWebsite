import type { MetadataRoute } from "next";
import { HYMN_FOLDERS } from "@/lib/folders";
import { ALBUMS } from "@/lib/albums";
import { getChutneyArtists, getChutneySorted, getWeddingSongs } from "@/lib/chutney";
import { getChowtalSorted } from "@/lib/chowtal";
import { getArtists, getBhajans, getCategories, getPlaylists } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "/",
    "/bhajans",
    "/albums",
    "/artists",
    "/folders",
    "/browse/bhagwan",
    "/browse/occasion",
    "/browse/type",
    "/calendar",
    "/chutney",
    "/chutney/artists",
    "/chowtal",
    "/wedding",
    "/playlists",
    "/contact",
    "/upload",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const [bhajans, artists, bhagwan, occasions, types, playlists] =
    await Promise.all([
      getBhajans(),
      getArtists(),
      getCategories("bhagwan"),
      getCategories("occasion"),
      getCategories("bhajan_type"),
      getPlaylists().catch(() => []),
    ]);

  for (const song of bhajans) {
    entries.push({
      url: absoluteUrl(`/bhajans/${song.slug}`),
      lastModified: song.updated_at ? new Date(song.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const artist of artists) {
    entries.push({
      url: absoluteUrl(`/artists/${artist.slug}`),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const album of ALBUMS) {
    entries.push({
      url: absoluteUrl(`/albums/${album.slug}`),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const folder of HYMN_FOLDERS) {
    entries.push({
      url: absoluteUrl(`/folders/${folder.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const category of bhagwan) {
    entries.push({
      url: absoluteUrl(`/browse/bhagwan/${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const category of occasions) {
    entries.push({
      url: absoluteUrl(`/browse/occasion/${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const category of types) {
    entries.push({
      url: absoluteUrl(`/browse/type/${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  for (const song of getChutneySorted()) {
    entries.push({
      url: absoluteUrl(`/chutney/${song.slug}`),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const artist of getChutneyArtists()) {
    entries.push({
      url: absoluteUrl(`/chutney/artists/${artist.slug}`),
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  for (const song of getWeddingSongs()) {
    entries.push({
      url: absoluteUrl(`/wedding/${song.slug}`),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const song of getChowtalSorted()) {
    entries.push({
      url: absoluteUrl(`/chowtal/${song.slug}`),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const playlist of playlists) {
    entries.push({
      url: absoluteUrl(`/playlists/${playlist.id}`),
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  return entries;
}
