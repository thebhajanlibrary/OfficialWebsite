import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clip(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function describeSong(
  title: string,
  artist: string | null | undefined,
  meaning: string | null | undefined
) {
  if (meaning?.trim()) return clip(meaning);
  const by = artist?.trim() ? ` by ${artist.trim()}` : "";
  return clip(
    `Play ${title}${by}. Read the lyrics in Roman, Hindi, and English on Bhajan Library.`
  );
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  index?: boolean;
  /** Skip the site-name template. Use on the homepage. */
  absolute?: boolean;
};

export function pageMeta({
  title,
  description,
  path,
  image,
  index = true,
  absolute = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const shareTitle = absolute ? title : `${title} · ${SITE_NAME}`;
  const shareImage = absoluteUrl(image || "/icons/logo-512.png");

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [{ url: shareImage, alt: title }],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: shareTitle,
      description,
      images: [shareImage],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: ["en", "hi"],
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        email: "thebhajanlibrary@gmail.com",
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icons/logo-512.png"),
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function songJsonLd(song: {
  title: string;
  slug: string;
  artist: string | null;
  description: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    url: absoluteUrl(`/bhajans/${song.slug}`),
    description: song.description,
    image: song.image ? absoluteUrl(song.image) : undefined,
    inLanguage: ["hi", "en"],
    byArtist: song.artist
      ? { "@type": "MusicGroup", name: song.artist }
      : undefined,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function collectionJsonLd(item: {
  name: string;
  path: string;
  description: string;
  kind?: "MusicAlbum" | "CollectionPage" | "Person";
}) {
  return {
    "@context": "https://schema.org",
    "@type": item.kind ?? "CollectionPage",
    name: item.name,
    url: absoluteUrl(item.path),
    description: item.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
