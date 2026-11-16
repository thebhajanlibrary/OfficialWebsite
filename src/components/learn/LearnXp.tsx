"use client";

import { useSyncExternalStore } from "react";
import { readProgress, subscribeLearnProgress } from "@/lib/learn/progress";

const getXp = () => readProgress().xp;
const serverXp = () => null;

export function LearnXp({ label = "Your XP" }: { label?: string }) {
  const xp = useSyncExternalStore<number | null>(subscribeLearnProgress, getXp, serverXp);

  return (
    <p className="text-sm text-muted">
      {label}: {xp === null ? "…" : xp}
    </p>
  );
}
