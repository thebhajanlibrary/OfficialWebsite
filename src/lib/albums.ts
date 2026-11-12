import { EVERYDAY_LIBRARY_SKIP_SLUGS, HYMN_FOLDERS } from "@/lib/folders";

export type Album = {
  slug: string;
  title: string;
  /** Primary singer credited on the album */
  artist: string;
  description: string;
  cover_url: string;
  /** Bhajan slugs in track order */
  track_slugs: string[];
  year?: number;
  label?: string;
  composer?: string;
  /** Alternate names that appear in track subtitles (not the main album title). */
  subtitle_aliases?: string[];
  /**
   * Remix / DJ compilations: show remixer on tracks, but do not
   * create entries on the Artists page or link to artist profiles.
   */
  omit_artists_from_index?: boolean;
  /**
   * Specialty sets (e.g. Phagwah chowtal CD) — available on Albums /
   * Chowtal, but hidden from All Bhajans list and library Play all.
   */
  omit_from_library?: boolean;
};

/**
 * Full albums (ordered track lists). Prefer this over loose playlists
 * when the source is a released CD / cassette set.
 */
export const ALBUMS: Album[] = [
  {
    slug: "aarti-archan-hari-om-sharan",
    title: "Aarti Archan",
    artist: "Hari Om Sharan & Nandini Sharan",
    year: 1982,
    label: "His Master's Voice",
    composer: "Hari Om Sharan",
    description:
      "Hari Om Sharan & Nandini Sharan’s 1982 HMV classic — prarthana, vandanás, and aartis for Ganesh, Lakshmi, Ram, Durga, and Shiva.",
    cover_url: "/images/albums/aarti-archan-hari-om-sharan.png",
    track_slugs: [
      "he-parmeshwar-vishwa-vidhaata-hari-om-sharan",
      "nish-din-namoon-ganpati-hari-om-sharan",
      "jai-jai-aarti-sab-mil-gaven-hari-om-sharan",
      "jai-lakshmi-kalyanji-maiya-nandini-sharan",
      "lakshmi-maiya-utaren-teri-aarti-hari-om-sharan",
      "jinke-hriday-shriram-rame-hari-om-sharan",
      "aarti-kije-shri-raghuvar-ki-hari-om-sharan",
      "mateshwari-jagdambike-nandini-sharan",
      "jai-ambe-durge-maiya-hari-om-sharan",
      "shiv-bhola-bhandari-he-hari-om-sharan",
      "om-jai-shiv-shakti-hare-hari-om-sharan",
    ],
  },
  {
    slug: "shiv-archana-hari-om-sharan",
    title: "Shiv Archana",
    artist: "Hari Om Sharan & Nandini Sharan",
    year: 1997,
    label: "T-Series",
    composer: "Nandini Sharan",
    description:
      "Hari Om Sharan & Nandini Sharan’s 1997 T-Series Shiva bhajan album (lyrics: Pt. Kiran Mishra) — Kailash devotionals, Shivratri celebration, and keertan for Vishwanath and Ambe Bhawani.",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    track_slugs: [
      "kailashwasi-devta-dinanath-hain-hari-om-sharan",
      "jahan-shivji-vichran-karte-hain-hari-om-sharan",
      "shambh-sadashiv-japle-re-hari-om-sharan",
      "jata-joot-mein-shivji-ke-hari-om-sharan",
      "keertan-jai-vishwa-nath-hari-om-sharan",
      "aaya-shivratri-tyohaar-hari-om-sharan",
      "shiv-shiv-japle-prani-hari-om-sharan",
      "lagan-tose-laagi-re-damruwale-hari-om-sharan",
      "shiv-ke-charanwa-mein-hari-om-sharan",
      "keertan-jayati-jai-ambe-bhawani-hari-om-sharan",
    ],
  },
  {
    slug: "durga-bhajans-shri-prakash-gossai",
    title: "Durga Bhajans",
    artist: "Shri Prakash Gossai",
    label: "Pratiksha Gosain",
    description:
      "Shri Prakash Gossai’s Durga Bhajans — Navratri devotionals to Maa Ambe Bhavani and Divine Mother Durga.",
    cover_url: "/images/albums/durga-bhajans-shri-prakash-gossai.png",
    track_slugs: ["jai-jai-ambe-bhavani-maa-shri-prakash-gossai"],
  },
  {
    slug: "premanjali-pushpanjali-hari-om-sharan",
    title: "Premanjali Pushpanjali",
    artist: "Hari Om Sharan",
    year: 1972,
    label: "Saregama",
    subtitle_aliases: ["Pushpanjali (1972)"],
    description:
      "Hari Om Sharan — Premanjali Pushpanjali (Saregama). Includes tracks from the original 1972 HMV Pushpanjali (ECSD 2721), such as Maili Chadar Odh Ke and Tera Ramji Karenge Beda Paar.",
    cover_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
    track_slugs: [
      "mailee-chaadar-hari-om-sharan",
      "tera-ramji-karenge-beda-paar-hari-om-sharan",
    ],
  },
  {
    slug: "art-of-living-ankit-batra",
    title: "Art of Living",
    artist: "Ankit Batra",
    label: "Art of Living",
    description:
      "Ankit Batra’s Art of Living devotionals — gentle Krishna and Ram bhajans for satsang and quiet listening.",
    cover_url: "/images/achutam-keshavam-ankit-batra-square.png",
    track_slugs: ["achutam-keshavam-ankit-batra"],
  },
  {
    slug: "laxmi-vandana-basdeo-jaikaran",
    title: "Laxmi Vandana",
    artist: "Pundit Basdeo Jaikaran",
    description:
      "Trinidad satsang album by Pundit Basdeo Jaikaran — Lakshmi prayers and aarti, Ramayan chaupai, Kewat (Khawat) bhajan, and Shiva’s Bam Bam Bhola. Distributed via Mohabir Records (USA).",
    cover_url: "/images/albums/laxmi-vandana-square.png",
    label: "Mohabir Records",
    track_slugs: [
      "prayers-introduction-basdeo-jaikaran",
      "invocation-basdeo-jaikaran",
      "hay-lakshmi-mata-daya-karo-basdeo-jaikaran",
      "jai-jai-lakshmi-basdeo-jaikaran",
      "lakshmi-vandana-basdeo-jaikaran",
      "lakshmi-aarti-basdeo-jaikaran",
      "ramayan-chaupai-basdeo-jaikaran",
      "naman-karo-sri-ram-basdeo-jaikaran",
      "khawat-bhajan-basdeo-jaikaran",
      "aaj-aayan-ban-say-basdeo-jaikaran",
      "jagar-bam-bam-bhola-basdeo-jaikaran",
    ],
  },
  {
    slug: "lets-play-holi",
    title: "Let's Play Holi",
    artist: "VP Premier",
    label: "Zone",
    omit_artists_from_index: true,
    description:
      "Holi remixes — Zone proudly presents remixes of favourite Holi songs by VP Premier, DJ Shane, Mistah Studz, DJ Tone, Mistah Mixup, DJ Xquizit, DJ Ryan Jhingree, DJ Snypa, DJ Hozz, DJ Rye, DJ Static Flow, and more.",
    cover_url: "/images/albums/lets-play-holi.png",
    track_slugs: [
      "rang-barse-vp-premier-lets-play-holi",
      "holi-khele-dj-shane-lets-play-holi",
      "holi-re-holi-mistah-studz-lets-play-holi",
      "ang-se-anga-dj-tone-lets-play-holi",
      "saat-range-mein-mistah-mixup-lets-play-holi",
      "aaj-na-choddenge-dj-xquizit-lets-play-holi",
      "holi-ki-din-dj-ryan-jhingree-lets-play-holi",
      "holiya-aaye-re-dj-snypa-lets-play-holi",
      "maro-bichkaar-dj-ryan-jhingree-lets-play-holi",
      "holi-aai-re-dj-snypa-lets-play-holi",
      "lets-play-holi-dj-hozz",
      "holi-re-dj-tone-dj-snypa-lets-play-holi",
      "holiya-main-ude-dj-rye-lets-play-holi",
      "ang-se-anga-mistah-studz-lets-play-holi",
      "saat-rang-mein-dj-tone-lets-play-holi",
      "holi-khele-dj-static-flow-lets-play-holi",
    ],
  },
  {
    slug: "shree-hanuman-chalisa-hariharan",
    title: "Shree Hanuman Chalisa (Hanuman Ashtak)",
    artist: "Hariharan",
    composer: "Lalit Sen",
    year: 1993,
    label: "T-Series",
    description:
      "Hariharan’s famous 1993 T-Series release — Shree Hanuman Chalisa with Hanuman Ashtak, plus Bajrang Baan, aarti, and related Hanuman bhajans. Music by Lalit Sen.",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    track_slugs: [
      "hanuman-chalisa-hariharan",
      "sankatmochan-hanuman-ashtak-hariharan",
      "bajrang-baan-hariharan",
      "shree-hanuman-stavan-hariharan",
      "he-bajrangbali-hanuman-hariharan",
      "jai-jai-hanuman-gusain-hariharan",
      "mangalmurti-maruti-nandan-hariharan",
      "pawansut-vinti-barambar-hariharan",
      "shree-hanuman-vandana-hariharan",
      "shree-hanuman-ji-ki-aarti-hariharan",
    ],
  },
  {
    slug: "star-melodies-ramdew-chaitoe",
    title: "The Star Melodies of Ramdew Chaitoe",
    artist: "Ramdew Chaitoe",
    year: 1976,
    label: "Chaitoe Productions",
    description:
      "Classic Surinamese baithak gana devotionals from The Star Melodies of Ramdew Chaitoe (Traditional Chaitoe) — also listed in the Chutney Style Bhajan folder.",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    track_slugs: [
      "ho-dja-ram-nam-ramdew-chaitoe",
      "kanha-moerlie-bedja-ramdew-chaitoe",
      "mai-ramta-jogi-raam-ramdew-chaitoe",
      "djagernath-poeri-ramdew-chaitoe",
      "bhaija-bharat-ghar-djawo-ramdew-chaitoe",
      "rako-ladj-hamarie-ramdew-chaitoe",
      "adjie-naath-kaise-arjun-ke-abhie-maan-ramdew-chaitoe",
      "bhoel-bisar-mati-ramdew-chaitoe",
      "koi-na-banai-ramdew-chaitoe",
    ],
  },
  {
    slug: "yaad-sangeet-harry-panday",
    title: "Yaad Sangeet",
    artist: "Harry Panday",
    label: "Mohabir Records",
    description:
      "Harry Panday’s Yaad Sangeet (Mohabir Records) — full album of satsang bhajans and prayers, including Ram Ratan, He Prabhu Anand Data, and Hanuman Chalisa.",
    cover_url: "/images/albums/yaad-sangeet-harry-panday.png",
    track_slugs: [
      "aaj-andhay-ray-harry-panday",
      "payo-ji-mere-ram-ratan-dhan-payo",
      "he-prabhu-anand-data",
      "bandow-charan-harry-panday",
      "jai-ganesh-harry-panday",
      "rakh-laaj-harry-panday",
      "sree-ram-harry-panday",
      "ab-soup-deeva-harry-panday",
      "jai-krishna-hare-harry-panday",
      "bhajuman-hari-har-om-harry-panday",
      "jagambay-maiya-harry-panday",
      "jai-jai-bole-hanuman-harry-panday",
      "om-jai-jai-mahadev-harry-panday",
      "hanuman-chalisa-harry-panday",
    ],
  },
  {
    slug: "bhakti-instrumentals-kedar-pandit",
    title: "Bhakti — Instrumentals & Karaoke",
    artist: "Kedar Pandit",
    label: "Exotic India",
    omit_artists_from_index: true,
    description:
      "Instrumental and karaoke versions of classic devotionals (Exotic India). For singing along — skipped when you Play all / shuffle from All Bhajans; play from this album or the Instrumentals & Karaoke folder. Companion disc: Bhakti 3.",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    track_slugs: [
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
    ],
  },
  {
    slug: "bhakti-3-instrumentals-kedar-pandit",
    title: "Bhakti 3 — Instrumentals & Karaoke",
    artist: "Kedar Pandit",
    label: "Exotic India",
    omit_artists_from_index: true,
    description:
      "Volume 3 — instrumental and karaoke versions of immortal devotionals (Exotic India · Kedar Pandit). For singing along — skipped when you Play all / shuffle from All Bhajans; play from this album or the Instrumentals & Karaoke folder. Companion disc: Bhakti.",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    track_slugs: [
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
  {
    slug: "jai-shri-krishna-pandit-lal-singh",
    title: "Jai Shri Krishna",
    artist: "Pandit Lal Singh",
    description:
      "Krishna bhajans and kirtan by Pandit Lal Singh — invocational prayer through classic Krishna favourites for satsang.",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    track_slugs: [
      "invocational-prayer-pandit-lal-singh",
      "krishna-jinka-pandit-lal-singh",
      "krishna-kripalu-pandit-lal-singh",
      "kanha-kanhaiya-ray-pandit-lal-singh",
      "om-namo-shree-pandit-lal-singh",
      "jai-govinda-gopala-pandit-lal-singh",
      "mohan-hamaare-madhuban-pandit-lal-singh",
      "chalo-re-man-ganga-pandit-lal-singh",
      "baat-nihare-ghanshyam-pandit-lal-singh",
      "kanha-kanhaiya-mandala-pandit-lal-singh",
      "duniya-ke-sau-roop-pandit-lal-singh",
      "track-12-pandit-lal-singh",
    ],
  },
  {
    slug: "kirtan-yoga-acharya-arun-gossai",
    title: "Kirtan Yoga",
    artist: "Acharya Arun Gossai",
    description:
      "Kirtan Yoga — bhajans and kirtan by Acharya Arun Gossai (also known as Arun Gossai). Krishna, Ram, and Mother devotionals for satsang. Track 07 was not on this copy of the disc.",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    track_slugs: [
      "introduction-acharya-arun-gossai",
      "krishna-krishna-acharya-arun-gossai",
      "shri-ram-stuti-acharya-arun-gossai",
      "dwar-se-tere-acharya-arun-gossai",
      "baaje-re-muraliya-acharya-arun-gossai",
      "shri-ram-tumhare-mandir-mein-acharya-arun-gossai",
      "bruhi-mukundeti-acharya-arun-gossai",
      "kripa-ki-ek-najar-acharya-arun-gossai",
      "maiya-tere-dar-pe-acharya-arun-gossai",
    ],
  },
  {
    slug: "lets-sing-and-dance-with-dropati",
    title: "Let's Sing & Dance with Dropati",
    artist: "Dropati",
    omit_from_library: true,
    description:
      "Classic Surinamese wedding chutney and chutney-bhajan favourites by Dropati (Shrimati Draupadi Srikant Upadhya). Also listed under Traditional Chutney — not in All Bhajans Play all.",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    track_slugs: [
      "gauri-puja-dropati",
      "manika-dhar-jabiya-dropati",
      "moray-gari-suno-maharaj-dropati",
      "dasrathji-ayee-lay-dropati",
      "kay-dhanwa-tora-dropati",
      "kahay-raja-ramchandra-dropati",
      "sonay-kay-kharaun-dropati",
      "karlo-nar-bahjan-dropati",
      "sawaliya-kay-kounay-dropati",
      "gandhi-jawahar-dropati",
      "samdhi-dekho-baakay-dropati",
      "patna-sahar-guljau-dropati",
      "mainay-dayka-jagat-dropati",
      "banaras-raja-jai-ho-dropati",
      "paani-kay-nickalay-dropati",
      "gaya-ja-geet-milan-ke-dropati",
      "ya-mohammad-allah-dropati",
      "suhaagan-sundar-nath-dropati",
      "bhaag-rahee-dropati",
      "tassa-dropati",
    ],
  },
  {
    slug: "sweet-phagwah-songs-and-chowtal",
    title: "Sweet Phagwah Songs and Chowtal",
    artist: "Pt. Chunelall Narine & Jharna Mukherjee",
    year: 1998,
    label: "Mohabeer Records",
    composer: "Aghaaz Band",
    omit_artists_from_index: true,
    omit_from_library: true,
    description:
      "Mohabeer Records MO-191 (© 1998) — Phagwah songs (tracks 1–10) by Pt. Chunelall Narine & Jharna Mukherjee; chowtal & ulāra (tracks 11–12) by members of the Mahatma Gandhi Satsang Society (Queens). CD front: Phagwah Song · Chowtal & Ulara. Listed under Albums, Holi, and Chowtal — not in All Bhajans Play all.",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    track_slugs: [
      "rang-barse-chunelall-jharna",
      "holi-ayee-re-chunelall-jharna",
      "aaj-na-chorange-chunelall-jharna",
      "holi-ke-din-chunelall-jharna",
      "holi-re-holi-chunelall-jharna",
      "mere-pehle-chunelall-jharna",
      "rang-holi-ka-chunelall-jharna",
      "rang-ah-basanti-chunelall-jharna",
      "holi-ka-nandall-chunelall-jharna",
      "holi-kheai-raghu-chunelall-jharna",
      "gokula-chowtal-mahatma-gandhi-satsang",
      "horee-khalay-mahatma-gandhi-satsang",
    ],
  },
];

/** Normalize album / subtitle text for fuzzy matching (dashes, &amp;, etc.). */
export function normalizeAlbumText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[—–\-&]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Subtitle segments that are track metadata, not album names. */
function isNonAlbumSubtitleSegment(part: string): boolean {
  const trimmed = part.trim();
  if (!trimmed) return true;
  if (/^track \d+/i.test(trimmed)) return true;
  if (/^(opening|invocation|introduction)\b/i.test(trimmed)) return true;
  if (/^(holi remix|instrumental|karaoke)\b/i.test(trimmed)) return true;
  if (/^not the regular/i.test(trimmed)) return true;
  return false;
}

/** True when a subtitle segment refers to this album (for clickable links). */
export function isAlbumTitleSegment(part: string, album: Album): boolean {
  if (isNonAlbumSubtitleSegment(part)) return false;

  const nPart = normalizeAlbumText(part);
  const nTitle = normalizeAlbumText(album.title);
  if (!nPart || nPart.length < 3) return false;

  const aliases = (album.subtitle_aliases ?? []).map(normalizeAlbumText);
  if (nPart === nTitle || aliases.includes(nPart)) return true;

  // Premanjali Pushpanjali vs Pushpanjali (1972) — do not cross-link.
  const partHasPremanjali = nPart.includes("premanjali");
  const titleHasPremanjali = nTitle.includes("premanjali");
  if (partHasPremanjali !== titleHasPremanjali) return false;

  const partYear = part.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
  if (partYear) {
    if (album.year && String(album.year) !== partYear) return false;
    if (!album.year && !nTitle.includes(partYear)) return false;
  }

  // "Sweet Phagwah Songs" · "Bhakti Instrumentals & Karaoke", etc.
  if (nTitle.startsWith(nPart) && nPart.length >= 8) return true;
  if (nPart.startsWith(nTitle) && nTitle.length >= 8) return true;

  const partWords = nPart.split(" ").filter(Boolean);
  const titleWords = new Set(nTitle.split(" ").filter(Boolean));
  if (partWords.length >= 2 && partWords.every((w) => titleWords.has(w))) {
    return true;
  }

  // Distinctive multi-word album names embedded in longer subtitles.
  if (partWords.length >= 2 && nTitle.includes(nPart)) return true;

  // Companion discs share a "Bhakti" prefix — require volume hint when present.
  if (nPart.includes("bhakti") && nTitle.includes("bhakti")) {
    const partHas3 = nPart.includes("3");
    const titleHas3 = nTitle.includes("3");
    if (partHas3 === titleHas3 && nPart.includes("instrumental")) return true;
  }

  return false;
}

/** Which library album (if any) a subtitle segment refers to. */
export function albumForSubtitleSegment(part: string): Album | null {
  const matches = ALBUMS.filter((album) => isAlbumTitleSegment(part, album));
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0]!;

  const nPart = normalizeAlbumText(part);
  const exact = matches.find(
    (album) => normalizeAlbumText(album.title) === nPart
  );
  return exact ?? matches[0]!;
}

export function getAlbum(slug: string): Album | null {
  return ALBUMS.find((a) => a.slug === slug) ?? null;
}

export function albumForBhajan(bhajanSlug: string): Album | null {
  return ALBUMS.find((a) => a.track_slugs.includes(bhajanSlug)) ?? null;
}

export function trackNumberInAlbum(
  album: Album,
  bhajanSlug: string
): number | null {
  const i = album.track_slugs.indexOf(bhajanSlug);
  return i >= 0 ? i + 1 : null;
}

/** Remixer credits stay on the track — not on /artists. */
export function countsTowardArtistIndex(bhajanSlug: string): boolean {
  const album = albumForBhajan(bhajanSlug);
  return !album?.omit_artists_from_index;
}

/** Specialty album tracks hidden from All Bhajans / library Play all. */
export function isOmittedFromLibrary(bhajanSlug: string): boolean {
  if (EVERYDAY_LIBRARY_SKIP_SLUGS.has(bhajanSlug)) return true;
  if (albumForBhajan(bhajanSlug)?.omit_from_library) return true;
  return HYMN_FOLDERS.some(
    (folder) =>
      folder.omit_from_library && folder.member_slugs?.includes(bhajanSlug)
  );
}

/**
 * Who owns this track on the Artists page.
 * Remix compilations are filed under the album artist (e.g. VP Premier),
 * while individual DJ credits stay on the track only.
 */
export function indexedArtistNameForBhajan(
  bhajanSlug: string,
  trackArtist: string | null | undefined
): string | null {
  const album = albumForBhajan(bhajanSlug);
  if (album?.omit_artists_from_index) {
    return album.artist;
  }
  const name = trackArtist?.trim();
  return name ? name : null;
}
