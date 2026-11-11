export type CategoryType =
  | "bhagwan"
  | "occasion"
  | "bhajan_type"
  | "theme"
  | "language"
  | "suitability";

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  created_at: string;
};

export type Bhajan = {
  id: string;
  title: string;
  alternate_title: string | null;
  slug: string;
  artist_version: string | null;
  roman_lyrics: string;
  devanagari_lyrics: string | null;
  translation: string | null;
  meaning: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  is_favourite?: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

export type BhajanWithCategories = Bhajan & {
  categories: Category[];
  /** Small list-card image */
  thumbnail_url?: string | null;
  /** Player cover on detail page (not shown on list cards) */
  cover_url?: string | null;
  /** Corner mini-player art */
  mini_cover_url?: string | null;
  /** Player frame shape — square for 1:1 album art */
  player_cover_aspect?: "wide" | "square";
  /** Optional YouTube link kept alongside local MP3/video */
  youtube_url?: string | null;
  /** Optional local clip / video on the song page alongside audio */
  video_url?: string | null;
  /** Poster for video_url */
  video_poster_url?: string | null;
  /** Short credit under the song-page video clip */
  video_credit?: string | null;
};

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type PlaylistItem = {
  id: string;
  playlist_id: string;
  bhajan_id: string;
  position: number;
  notes: string | null;
};

export type PlaylistItemWithBhajan = PlaylistItem & {
  bhajan: Bhajan;
};

export type PlaylistWithItems = Playlist & {
  items: PlaylistItemWithBhajan[];
};

export type BhajanFormData = {
  title: string;
  alternate_title: string;
  slug: string;
  artist_version: string;
  roman_lyrics: string;
  devanagari_lyrics: string;
  translation: string;
  meaning: string;
  audio_url: string;
  pdf_url: string;
  is_favourite?: boolean;
  display_order: string;
  category_ids: string[];
};

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  bhagwan: "Bhagwan",
  occasion: "Occasion",
  bhajan_type: "Bhajan type",
  theme: "Theme",
  language: "Language",
  suitability: "Suitability",
};
