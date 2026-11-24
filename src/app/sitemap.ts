import type { MetadataRoute } from "next";
import { HYMN_FOLDERS, isIndexableFolder } from "@/lib/folders";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/folders") },
    ...HYMN_FOLDERS.filter(isIndexableFolder).map((folder) => ({
      url: absoluteUrl(`/folders/${folder.slug}`),
    })),
  ];
}
