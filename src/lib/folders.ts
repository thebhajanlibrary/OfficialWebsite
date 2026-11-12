import { matchesSearchQuery } from "@/lib/search-match";
import { slugify } from "@/lib/utils";

export type HymnFolder = {
  slug: string;
  title: string;
  description: string;
  /** Large cover on Folders list / folder detail — not a list thumbnail */
  cover_url?: string;
  /**
   * Explicit members for related-set folders (different songs).
   * When set, membership is only by this list (in this order).
   * When omitted, membership uses hymn-slug prefix matching
   * (e.g. every Hanuman Chalisa version).
   */
  member_slugs?: string[];
  search_aliases?: string[];
  /** Hidden from All Bhajans and everyday category lists. */
  omit_from_library?: boolean;
};

/**
 * Folders group multiple versions of the same hymn
 * (e.g. every Hanuman Chalisa recording), or a related set.
 */
export const HYMN_FOLDERS: HymnFolder[] = [
  {
    slug: "bhajan-party-mix",
    title: "Bhajan Party Mix",
    description:
      "Upbeat remixes and party-style bhajans (not the regular satsang versions). Open this folder — or Play all here — to hear them; they are skipped when you Play all from All Bhajans or a category.",
    cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    member_slugs: [
      "hanuman-chalisa-mix",
      "bhajan-mawdness-gt-vibez",
      "bhajan-mawdness-2-gt-vibez",
      "munni-munni",
      "om-jai-jagdish-hare-remix",
      "om-namah-shivaya-mix-shreya-ghoshal",
      "shiva-aarti-remix",
      "bandow-charan-kamal-ragunandan-remix",
      "kahawa-se-aayo-bhagwane-xstatixz",
    ],
  },
  {
    slug: "chutney-style-bhajan",
    title: "Chutney Style Bhajan",
    description:
      "Indo-Caribbean baithak / chutney-style devotionals for satsang — Ram, Krishna, and more, from different singers. Starts with tracks from Ramdew Chaitoe’s The Star Melodies; more artists will be added.",
    cover_url: "/images/folders/chutney-style-bhajan/cover.jpg",
    search_aliases: ["chutney", "baithak", "chowtal", "chutney bhajan"],
    member_slugs: [
      "adjie-naath-kaise-arjun-ke-abhie-maan-ramdew-chaitoe",
      "bhaija-bharat-ghar-djawo-ramdew-chaitoe",
      "bhoel-bisar-mati-ramdew-chaitoe",
      "djagernath-poeri-ramdew-chaitoe",
      "gauri-puja-dropati",
      "ho-dja-ram-nam-ramdew-chaitoe",
      "kahawa-se-aayo-bhagwane-xstatixz",
      "kanha-moerlie-bedja-ramdew-chaitoe",
      "koi-na-banai-ramdew-chaitoe",
      "mai-ramta-jogi-raam-ramdew-chaitoe",
      "nanda-baba-anand-yankaran",
      "oh-maro-maro-pichakari-babla-kanchan",
      "radha-kanhaiya-babla-kanchan",
      "chalo-re-sabhi-ram-se-mile-babla-kanchan",
      "bolo-jai-jai-bajrangi-rakesh-yankaran",
      "rako-ladj-hamarie-ramdew-chaitoe",
      "nahi-chahiye-rang-mahal-dewindersingh-sewnath",
    ],
  },
  {
    slug: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    description:
      "All versions of the Hanuman Chalisa — different singers, same prayer.",
  },
  {
    slug: "om-jai-jagdish-hare",
    title: "Om Jai Jagadish Hare",
    description:
      "Vishnu aarti — regular satsang versions by different singers (not the party remix).",
    cover_url: "/images/om-jai-jagdish-hare-anuradha-paudwal-player.png",
  },
  {
    slug: "om-jai-lakshmi-mata",
    title: "Om Jai Lakshmi Mata",
    description:
      "Lakshmi aarti — regular satsang versions by different singers.",
    cover_url: "/images/om-jai-lakshmi-mata-prakash-gossai.jpg",
    member_slugs: [
      "om-jai-lakshmi-mata-prakash-gossai",
    ],
  },
  {
    slug: "o-palanhare",
    title: "O Palanhare",
    description:
      "O Nurturer — the Lagaan prayer and karaoke / instrumental versions for satsang.",
    cover_url: "/images/o-palanhare-lagaan.png",
    member_slugs: [
      "o-palanhare-lata-mangeshkar",
      "o-palanhare-kedar-pandit",
    ],
  },
  {
    slug: "garba",
    title: "Garba",
    description:
      "Navratri garba and timli. These stay in this folder and in the Navratri section — they are not everyday satsang bhajans.",
    cover_url: "/images/folders/garba/cover.jpg",
    search_aliases: ["garba", "dandiya", "timli", "navratri garba"],
    omit_from_library: true,
    member_slugs: [
      "fararar-eto-fare-re-kamlesh-barot",
      "mithe-ras-se-bharyo-kinjal-dave",
      "chogada-unplugged-darshan-raval",
      "chogada-darshan-raval",
      "kanudo-zilva-hendyo-geeta-rabari",
      "gori-tame-manda-lidha-mohi-raj-umesh-barot",
      "dakla-bandish-projekt",
      "moti-veraana-osman-mir",
      "dholida-gangubai-kathiawadi",
      "mor-bani-thanghat-kare",
      "radha-ne-shyam-mali-jashe",
      "vaagyo-re-dhol-hellaro",
      "garbe-ki-raat-rahul-vaidya",
      "nagada-sang-dhol-baaje",
      "shubhaarambh-kai-po-che",
      "kesariyo-aishwarya-majmudar",
      "gori-radha-ne-kalo-kaan-kirtidan-gadhvi",
      "karshan-bhagwan-chalya-aditya-gadhvi",
      "indhana-vinvaa-gayi-falguni-pathak",
      "zulan-morali-vagi-re-aditya-gadhvi",
      "halaji-tara-hath-vakhanu-aditya-gadhvi",
      "maar-to-mele-ishani-dave",
      "odhani-made-in-china",
      "sanedo-made-in-china",
      "khelo-khelo-re-bhavani-maa-geeta-rabari",
    ],
  },
  {
    slug: "aarti",
    title: "Aarti",
    description:
      "Regular satsang aartis — Vishnu, Ganesh, Hanuman, Lakshmi, Ram, Durga, Shiva, and more. Party remixes stay in Bhajan Party Mix.",
    cover_url: "/images/aarti-folder-diya.png",
    member_slugs: [
      "om-jai-jagdish-hare-anuradha-paudwal",
      "om-jai-jagdish-hare-maanya-arora",
      "om-jai-jagdish-hare-hari-om-sharan",
      "om-jai-lakshmi-mata-prakash-gossai",
      "lakshmi-aarti-basdeo-jaikaran",
      "jai-he-mahalaxmi-maa-usha-mangeshkar",
      "hey-maha-laxmi-maa-usha-mangeshkar",
      "bhagwat-bhagwan-ki-hai-aarti-hemant-kumar",
      "lakshmi-maiya-utaren-teri-aarti-hari-om-sharan",
      "jai-lakshmi-kalyanji-maiya-nandini-sharan",
      "jai-ganesh-harry-panday",
      "jai-jai-aarti-sab-mil-gaven-hari-om-sharan",
      "aarti-kije-shri-raghuvar-ki-hari-om-sharan",
      "shree-hanuman-ji-ki-aarti-hariharan",
      "jay-adhyashakti-aarti-kinjal-dave",
      "jai-ambe-durge-maiya-hari-om-sharan",
      "mateshwari-jagdambike-nandini-sharan",
      "om-jai-shiv-shakti-hare-hari-om-sharan",
      "om-jai-jai-mahadev-harry-panday",
      "shiv-bhola-bhandari-he-hari-om-sharan",
      "aarti-kunj-bihari-ki-hariom-sharad",
    ],
  },
  {
    slug: "holi",
    title: "Holi",
    description:
      "Holi / Phagwah songs for the festival of colours — Indo-Caribbean chutney bhajans and classic Holi kirtan. Remixes from Let's Play Holi stay in that album.",
    cover_url: "/images/albums/lets-play-holi.png",
    member_slugs: [
      "holi-khelai-raghuveera",
      "oh-maro-maro-pichakari-babla-kanchan",
      "radha-kanhaiya-babla-kanchan",
    ],
  },
  {
    slug: "wedding",
    title: "Wedding",
    description:
      "Indo-Caribbean wedding songs — chutney, chutney-bhajan, lawa, sehra, matkorwa, bidai, and more. Dropati's full album, Paar Karo remix, and other marriage favourites.",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    search_aliases: [
      "wedding",
      "shaadi",
      "matkorwa",
      "lawa",
      "sehra",
      "dropati",
      "paar karo",
      "pari karo",
    ],
  },
  {
    slug: "birthday-songs",
    title: "Birthday & Blessings",
    description:
      "Evergreen birthday anthems, long life wishes (tu jiye hazaron saal), and parent blessings for children — sung for family satsang, birthdays, and naming ceremonies.",
    cover_url: "/images/folders/birthday-songs/cover.jpg",
    member_slugs: [
      "baar-baar-din-yeh-aaye",
      "badhai-ho-badhai-janamdin-ki-lata-mangeshkar",
      "o-nanhe-se-farishte-mohammed-rafi",
      "tujhe-suraj-kahoon-ya-chanda-manna-dey",
      "shiva-hare-shri-prakash-gossai",
    ],
    search_aliases: ["birthday", "birthdays", "happy-birthday", "janamdin"],
  },
  {
    slug: "instrumentals-karaoke",
    title: "Instrumentals & Karaoke",
    description:
      "Instrumental and karaoke versions for singing along — not for All Bhajans Play all / shuffle. Open this folder (or the album) to play them.",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    member_slugs: [
      "raghupati-raghav-rajaram-kedar-pandit",
      "shyam-teri-bansi-kedar-pandit",
      "payoji-maine-ram-ratan-kedar-pandit",
      "yashomati-maiyya-kedar-pandit",
      "allah-tero-naam-kedar-pandit",
      "om-jai-jagdish-hare-kedar-pandit",
      "jyot-se-jyot-kedar-pandit",
      "jaise-suraj-ki-garmi-kedar-pandit",
      "hum-ko-manki-shakti-kedar-pandit",
      "man-tarpat-hari-darshan-ko-aaj-kedar-pandit",
      "jaise-radha-ne-mala-japi-kedar-pandit",
      "o-palanhare-kedar-pandit",
      "aisi-laagi-lagan-kedar-pandit",
      "badi-der-bhai-nandlala-kedar-pandit",
      "ek-tu-hi-bharosa-kedar-pandit",
      "darshan-do-ghanshyam-kedar-pandit",
      "hey-ram-hey-ram-kedar-pandit",
      "jago-mohan-pyare-kedar-pandit",
      "main-to-aarti-utaroon-kedar-pandit",
      "o-duniya-ke-rakhwale-kedar-pandit",
      "teri-hai-zameen-tera-aasman-kedar-pandit",
      "brindaban-ka-krishna-kanhaiya-kedar-pandit",
      "yashoda-ka-nandlala-kedar-pandit",
      "chalo-bulawa-aaya-hai-kedar-pandit",
    ],
  },
];

export function getFolder(slug: string): HymnFolder | null {
  return HYMN_FOLDERS.find((folder) => folder.slug === slug) ?? null;
}

/** Party / DJ remixes and instrumental karaoke — listed in the library, but skipped in All Bhajans & category Play all / shuffle. */
const PARTY_MIX_REGULAR_EXCEPTIONS = new Set([
  // Regular bhajan that also sits well in the party mix folder
  "munni-munni",
]);

const LIBRARY_QUEUE_SKIP_FOLDERS = [
  "bhajan-party-mix",
  "instrumentals-karaoke",
] as const;

function isMemberOfFolder(folderSlug: string, slug: string): boolean {
  return Boolean(getFolder(folderSlug)?.member_slugs?.includes(slug));
}

/** True for Bhajan Party Mix remixes (not instrumentals). */
export function isBhajanPartyMixTrack(slug: string): boolean {
  if (PARTY_MIX_REGULAR_EXCEPTIONS.has(slug)) return false;
  return isMemberOfFolder("bhajan-party-mix", slug);
}

/** True for instrumental / karaoke tracks (e.g. Kedar Pandit Bhakti CD). */
export function isInstrumentalKaraokeTrack(slug: string): boolean {
  return isMemberOfFolder("instrumentals-karaoke", slug);
}

/** True when a track should be skipped from library / category Play all & shuffle. */
/** Recordings that stay in a folder and are left out of All Bhajans. */
export const EVERYDAY_LIBRARY_SKIP_SLUGS = new Set([
  "nahi-chahiye-rang-mahal-dewindersingh-sewnath",
]);

export function isLibraryQueueSkipTrack(slug: string): boolean {
  if (PARTY_MIX_REGULAR_EXCEPTIONS.has(slug)) return false;
  return LIBRARY_QUEUE_SKIP_FOLDERS.some((folderSlug) =>
    isMemberOfFolder(folderSlug, slug)
  );
}

export function bhajanBelongsToFolder(
  folderSlug: string,
  bhajan: { title: string; slug: string; alternate_title?: string | null }
): boolean {
  const folder = getFolder(folderSlug);
  if (!folder) return false;

  // Party remixes / instrumentals stay in their own folders only (unless listed)
  if (
    folderSlug !== "bhajan-party-mix" &&
    folderSlug !== "instrumentals-karaoke" &&
    isLibraryQueueSkipTrack(bhajan.slug) &&
    !folder.member_slugs?.includes(bhajan.slug)
  ) {
    return false;
  }

  if (folder.member_slugs?.length) {
    return folder.member_slugs.includes(bhajan.slug);
  }

  const slug = bhajan.slug.toLowerCase();
  const title = slugify(bhajan.title);
  const alt = slugify(bhajan.alternate_title ?? "");

  // Folder slug is the hymn key; versions use folder-slug or folder-slug-<artist>
  return (
    slug === folder.slug ||
    slug.startsWith(`${folder.slug}-`) ||
    title === folder.slug ||
    title.startsWith(`${folder.slug}-`) ||
    alt === folder.slug ||
    alt.startsWith(`${folder.slug}-`)
  );
}

export function folderForBhajan(bhajan: {
  title: string;
  slug: string;
  alternate_title?: string | null;
}): HymnFolder | null {
  return (
    HYMN_FOLDERS.find((folder) =>
      bhajanBelongsToFolder(folder.slug, bhajan)
    ) ?? null
  );
}

export function searchFolders(query: string): HymnFolder[] {
  const q = query.trim();
  if (!q) return [];
  return HYMN_FOLDERS.filter((folder) => {
    const haystack = [
      folder.title,
      folder.slug.replace(/-/g, " "),
      folder.description,
      ...(folder.search_aliases ?? []),
    ]
      .join("\n");
    return matchesSearchQuery(haystack, q);
  }).sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
}
