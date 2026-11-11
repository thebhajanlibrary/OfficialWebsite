"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteSubmission as deleteSub,
  getSubmissionById,
  saveSubmission,
  updateSubmissionStatus,
  type SongSection,
  type SongSubmission,
  type SubmissionStatus,
} from "@/lib/submissions";
import { emptyToNull, slugify } from "@/lib/utils";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const AUDIO_UPLOADS_DIR = path.join(UPLOADS_DIR, "audio");
const IMAGE_UPLOADS_DIR = path.join(UPLOADS_DIR, "images");

function ensureUploadDirs() {
  if (!fs.existsSync(AUDIO_UPLOADS_DIR)) {
    fs.mkdirSync(AUDIO_UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGE_UPLOADS_DIR)) {
    fs.mkdirSync(IMAGE_UPLOADS_DIR, { recursive: true });
  }
}

async function saveUploadedFile(
  file: File,
  targetDir: string,
  urlPrefix: string
): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) return null;
  ensureUploadDirs();

  const ext = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, ext);
  const cleanBase = slugify(baseName) || "upload";
  const uniqueName = `${cleanBase}-${Date.now()}${ext}`;
  const targetPath = path.join(targetDir, uniqueName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  return `${urlPrefix}/${uniqueName}`;
}

export type SubmitSongResult = {
  success: boolean;
  message?: string;
  submissionId?: string;
  errors?: Record<string, string>;
};

export async function submitSongAction(
  _prevState: SubmitSongResult | null,
  formData: FormData
): Promise<SubmitSongResult> {
  const title = String(formData.get("title") ?? "").trim();
  const artistName = String(formData.get("artist_name") ?? "").trim();
  const romanLyrics = String(formData.get("roman_lyrics") ?? "").trim();
  const section = (String(formData.get("section") ?? "bhajans").trim() ||
    "bhajans") as SongSection;
  const youtubeUrl = emptyToNull(String(formData.get("youtube_url") ?? ""));
  const alternateTitle = emptyToNull(String(formData.get("alternate_title") ?? ""));
  const devanagariLyrics = emptyToNull(String(formData.get("devanagari_lyrics") ?? ""));
  const translation = emptyToNull(String(formData.get("translation") ?? ""));
  const meaning = emptyToNull(String(formData.get("meaning") ?? ""));
  const submitterName = emptyToNull(String(formData.get("submitter_name") ?? ""));
  const submitterEmail = emptyToNull(String(formData.get("submitter_email") ?? ""));
  const submitterNotes = emptyToNull(String(formData.get("submitter_notes") ?? ""));

  const rawCategories = formData.getAll("category_slugs").map(String);
  const categorySlugs = rawCategories.filter((c) => c.trim().length > 0);

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Song title is required";
  if (!artistName) errors.artist_name = "Artist / singer name is required";
  if (!romanLyrics) errors.roman_lyrics = "Roman / English lyrics are required";

  const audioFile = formData.get("audio_file") as File | null;
  const audioUrlInput = emptyToNull(String(formData.get("audio_url") ?? ""));
  const imageFile = formData.get("image_file") as File | null;
  const imageUrlInput = emptyToNull(String(formData.get("thumbnail_url") ?? ""));

  if (!youtubeUrl && !audioUrlInput && (!audioFile || audioFile.size === 0)) {
    errors.media = "Please provide either a YouTube link or upload an audio file.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    let finalAudioUrl = audioUrlInput;
    if (audioFile && audioFile.size > 0) {
      const savedAudio = await saveUploadedFile(
        audioFile,
        AUDIO_UPLOADS_DIR,
        "/uploads/audio"
      );
      if (savedAudio) finalAudioUrl = savedAudio;
    }

    let finalImageUrl = imageUrlInput;
    if (imageFile && imageFile.size > 0) {
      const savedImage = await saveUploadedFile(
        imageFile,
        IMAGE_UPLOADS_DIR,
        "/uploads/images"
      );
      if (savedImage) finalImageUrl = savedImage;
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const submission: SongSubmission = {
      id,
      title,
      alternate_title: alternateTitle,
      artist_name: artistName,
      section,
      category_slugs: categorySlugs.length > 0 ? categorySlugs : ["general"],
      youtube_url: youtubeUrl,
      audio_url: finalAudioUrl,
      thumbnail_url: finalImageUrl,
      roman_lyrics: romanLyrics,
      devanagari_lyrics: devanagariLyrics,
      translation,
      meaning,
      submitter_name: submitterName,
      submitter_email: submitterEmail,
      submitter_notes: submitterNotes,
      status: "pending",
      admin_notes: null,
      created_at: now,
      updated_at: now,
    };

    saveSubmission(submission);
    revalidatePath("/admin/submissions");
    revalidatePath("/admin");

    return {
      success: true,
      submissionId: id,
      message: "Your song has been successfully submitted for review!",
    };
  } catch (err) {
    console.error("Submission failed:", err);
    return {
      success: false,
      message: "An unexpected error occurred while saving your submission.",
    };
  }
}

export async function updateSubmissionStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as SubmissionStatus;
  const adminNotes = emptyToNull(String(formData.get("admin_notes") ?? ""));

  if (!id || !status) {
    throw new Error("ID and status are required");
  }

  updateSubmissionStatus(id, status, adminNotes);
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin");
  redirect("/admin/submissions");
}

export async function deleteSubmissionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("ID is required");

  deleteSub(id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  redirect("/admin/submissions");
}

export async function editSubmissionDetailsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("ID is required");

  const existing = getSubmissionById(id);
  if (!existing) throw new Error("Submission not found");

  const title = String(formData.get("title") ?? "").trim() || existing.title;
  const alternateTitle = emptyToNull(String(formData.get("alternate_title") ?? ""));
  const artistName =
    String(formData.get("artist_name") ?? "").trim() || existing.artist_name;
  const section = (String(formData.get("section") ?? existing.section).trim() ||
    existing.section) as SongSection;
  const youtubeUrl = emptyToNull(String(formData.get("youtube_url") ?? ""));
  const audioUrl = emptyToNull(String(formData.get("audio_url") ?? ""));
  const thumbnailUrl = emptyToNull(String(formData.get("thumbnail_url") ?? ""));
  const romanLyrics =
    String(formData.get("roman_lyrics") ?? "").trim() || existing.roman_lyrics;
  const devanagariLyrics = emptyToNull(String(formData.get("devanagari_lyrics") ?? ""));
  const translation = emptyToNull(String(formData.get("translation") ?? ""));
  const meaning = emptyToNull(String(formData.get("meaning") ?? ""));
  const adminNotes = emptyToNull(String(formData.get("admin_notes") ?? ""));
  const status = (String(formData.get("status") ?? existing.status).trim() ||
    existing.status) as SubmissionStatus;

  const rawCategories = formData.getAll("category_slugs").map(String);
  const categorySlugs =
    rawCategories.length > 0 ? rawCategories : existing.category_slugs;

  const updated: SongSubmission = {
    ...existing,
    title,
    alternate_title: alternateTitle,
    artist_name: artistName,
    section,
    category_slugs: categorySlugs,
    youtube_url: youtubeUrl,
    audio_url: audioUrl,
    thumbnail_url: thumbnailUrl,
    roman_lyrics: romanLyrics,
    devanagari_lyrics: devanagariLyrics,
    translation,
    meaning,
    admin_notes: adminNotes,
    status,
    updated_at: new Date().toISOString(),
  };

  saveSubmission(updated);
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/submissions/${id}`);
}
