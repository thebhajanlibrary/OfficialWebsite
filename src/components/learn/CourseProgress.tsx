"use client";

import { useSyncExternalStore } from "react";
import { Check, Sparkles, Trophy } from "lucide-react";
import { readProgress, subscribeLearnProgress } from "@/lib/learn/progress";

function snapshot() {
  return JSON.stringify(readProgress());
}

export function CourseProgress({ lessonIds }: { lessonIds: string[] }) {
  const saved = useSyncExternalStore(subscribeLearnProgress, snapshot, () => "");
  const progress = saved ? JSON.parse(saved) as ReturnType<typeof readProgress> : null;
  const complete = lessonIds.filter((id) => progress?.completedLessonIds.includes(id)).length;
  const percent = lessonIds.length ? Math.round(complete / lessonIds.length * 100) : 0;

  return (
    <div className="rounded-3xl border-2 border-border border-b-4 bg-surface p-6">
      <div className="flex items-center gap-3"><Trophy className="h-7 w-7 text-[#e5a414]" aria-hidden="true" /><h3 className="text-lg font-bold">Your progress</h3></div>
      <div className="my-5 flex items-center justify-between rounded-2xl bg-[#fff3d4] p-4 text-[#835800]"><span className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-5 w-5" aria-hidden="true" /> Total XP</span><span className="text-2xl font-extrabold">{progress?.xp ?? "—"}</span></div>
      <p className="mb-3 flex justify-between gap-3 text-sm font-bold"><span>Available lessons</span><span>{complete}/{lessonIds.length}</span></p>
      <div role="progressbar" aria-label="Completed available lessons" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-4 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-[#58b51d] transition-[width] motion-reduce:transition-none" style={{ width: `${percent}%` }} /></div>
      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#428b19]" aria-hidden="true" />{complete > 0 ? "Great work! Revisit a lesson to keep practicing." : "Finish your first lesson and watch your progress grow."}</p>
    </div>
  );
}
