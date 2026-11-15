import { NextResponse } from "next/server";
import { runPlaybackCheck } from "@/lib/playback-health";

export const maxDuration = 60;

/** Morning check. Netlify calls this with PLAYBACK_CHECK_SECRET. */
export async function POST(request: Request) {
  const secret = process.env.PLAYBACK_CHECK_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const report = await runPlaybackCheck();
  return NextResponse.json({
    ok: true,
    checked: report.lastBatch,
    total: report.total,
    broken: report.broken.length,
  });
}
