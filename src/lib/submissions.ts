import fs from "fs";
import path from "path";
import { slugify } from "@/lib/utils";

export type SongSection = "bhajans" | "chutney" | "wedding" | "chowtal";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export type SongSubmission = {
  id: string;
  title: string;
  alternate_title?: string | null;
  artist_name: string;
  section: SongSection;
  category_slugs: string[];
  youtube_url?: string | null;
  audio_url?: string | null;
  thumbnail_url?: string | null;
  roman_lyrics: string;
  devanagari_lyrics?: string | null;
  translation?: string | null;
  meaning?: string | null;
  submitter_name?: string | null;
  submitter_email?: string | null;
  submitter_notes?: string | null;
  status: SubmissionStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

function ensureStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize submissions storage:", err);
  }
}

export function getAllSubmissions(): SongSubmission[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return [];
  } catch (err) {
    console.error("Error reading submissions.json:", err);
    return [];
  }
}

export function getSubmissionById(id: string): SongSubmission | null {
  const all = getAllSubmissions();
  return all.find((s) => s.id === id) ?? null;
}

export function getSubmissionsByStatus(status: SubmissionStatus): SongSubmission[] {
  const all = getAllSubmissions();
  return all.filter((s) => s.status === status);
}

export function getSubmissionCounts(): {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
} {
  const all = getAllSubmissions();
  return {
    pending: all.filter((s) => s.status === "pending").length,
    approved: all.filter((s) => s.status === "approved").length,
    rejected: all.filter((s) => s.status === "rejected").length,
    total: all.length,
  };
}

export function saveSubmission(submission: SongSubmission): void {
  ensureStorage();
  const all = getAllSubmissions();
  const index = all.findIndex((s) => s.id === submission.id);
  if (index >= 0) {
    all[index] = { ...submission, updated_at: new Date().toISOString() };
  } else {
    all.unshift(submission);
  }
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminNotes?: string | null
): SongSubmission | null {
  const submission = getSubmissionById(id);
  if (!submission) return null;
  const updated: SongSubmission = {
    ...submission,
    status,
    admin_notes: adminNotes !== undefined ? adminNotes : submission.admin_notes,
    updated_at: new Date().toISOString(),
  };
  saveSubmission(updated);
  return updated;
}

export function deleteSubmission(id: string): boolean {
  ensureStorage();
  const all = getAllSubmissions();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export function generateSuggestedSlug(title: string, artistName: string): string {
  const cleanTitle = slugify(title);
  const cleanArtist = slugify(artistName);
  return cleanArtist ? `${cleanTitle}-${cleanArtist}` : cleanTitle;
}
