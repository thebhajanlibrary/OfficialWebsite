"use server";

import { revalidatePath } from "next/cache";
import { runPlaybackCheck } from "@/lib/playback-health";

export async function checkPlaybackAction() {
  await runPlaybackCheck();
  revalidatePath("/admin");
}
