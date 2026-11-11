"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { emptyToNull, slugify } from "@/lib/utils";

function requireFields(formData: FormData, fields: string[]) {
  for (const field of fields) {
    const value = String(formData.get(field) ?? "").trim();
    if (!value) throw new Error(`${field} is required`);
  }
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveBhajanAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim() || null;
  requireFields(formData, ["title", "roman_lyrics"]);

  const title = String(formData.get("title")).trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const categoryIds = formData.getAll("category_ids").map(String);

  const payload = {
    title,
    alternate_title: emptyToNull(String(formData.get("alternate_title") ?? "")),
    slug,
    artist_version: emptyToNull(String(formData.get("artist_version") ?? "")),
    roman_lyrics: String(formData.get("roman_lyrics")).trim(),
    devanagari_lyrics: emptyToNull(
      String(formData.get("devanagari_lyrics") ?? "")
    ),
    translation: emptyToNull(String(formData.get("translation") ?? "")),
    meaning: emptyToNull(String(formData.get("meaning") ?? "")),
    audio_url: emptyToNull(String(formData.get("audio_url") ?? "")),
    pdf_url: emptyToNull(String(formData.get("pdf_url") ?? "")),
    display_order: (() => {
      const raw = String(formData.get("display_order") ?? "").trim();
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    })(),
  };

  const supabase = await createClient();
  let bhajanId = id;

  if (id) {
    const { error } = await supabase.from("bhajans").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("bhajans")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    bhajanId = data.id;
  }

  if (!bhajanId) throw new Error("Missing bhajan id");

  const { error: deleteError } = await supabase
    .from("bhajan_categories")
    .delete()
    .eq("bhajan_id", bhajanId);
  if (deleteError) throw deleteError;

  if (categoryIds.length > 0) {
    const { error: insertError } = await supabase
      .from("bhajan_categories")
      .insert(
        categoryIds.map((category_id) => ({
          bhajan_id: bhajanId,
          category_id,
        }))
      );
    if (insertError) throw insertError;
  }

  revalidatePath("/");
  revalidatePath("/bhajans");
  revalidatePath("/browse", "layout");
  revalidatePath(`/bhajans/${slug}`);
  redirect(`/bhajans/${slug}`);
}

export async function deleteBhajanAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const supabase = await createClient();
  const { error } = await supabase.from("bhajans").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/bhajans");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function savePlaylistAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim() || null;
  requireFields(formData, ["name"]);

  const name = String(formData.get("name")).trim();
  const description = emptyToNull(String(formData.get("description") ?? ""));
  const bhajanIds = formData.getAll("bhajan_ids").map(String);
  const notes = formData.getAll("notes").map(String);

  const supabase = await createClient();
  let playlistId = id;

  if (id) {
    const { error } = await supabase
      .from("playlists")
      .update({ name, description })
      .eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("playlists")
      .insert({ name, description })
      .select("id")
      .single();
    if (error) throw error;
    playlistId = data.id;
  }

  if (!playlistId) throw new Error("Missing playlist id");

  const { error: deleteError } = await supabase
    .from("playlist_items")
    .delete()
    .eq("playlist_id", playlistId);
  if (deleteError) throw deleteError;

  if (bhajanIds.length > 0) {
    const { error: insertError } = await supabase.from("playlist_items").insert(
      bhajanIds.map((bhajan_id, position) => ({
        playlist_id: playlistId,
        bhajan_id,
        position,
        notes: emptyToNull(notes[position] ?? ""),
      }))
    );
    if (insertError) throw insertError;
  }

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
  redirect(`/playlists/${playlistId}`);
}

export async function deletePlaylistAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const supabase = await createClient();
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/playlists");
  revalidatePath("/admin");
  redirect("/admin");
}
