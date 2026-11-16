"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import type { VocabEntry } from "@/lib/learn/types";

const BUTTON = "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-border bg-surface px-5 py-3 text-sm font-bold transition hover:bg-surface-muted active:translate-y-0.5";

export function KitchenStudy({ entries, compact = false, onReady }: { entries: VocabEntry[]; compact?: boolean; onReady?: () => void }) {
  const [mode, setMode] = useState<"browse" | "cards">(compact ? "cards" : "browse");
  const [queue, setQueue] = useState(entries);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const current = queue[0];

  function restart(shuffle = false) {
    const next = [...entries];
    if (shuffle) {
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
    }
    setQueue(next); setKnown(0); setRevealed(false); setMode("cards");
  }

  function answer(remembered: boolean) {
    setQueue((items) => remembered ? items.slice(1) : [...items.slice(1), items[0]]);
    if (remembered) setKnown((value) => value + 1);
    setRevealed(false);
  }

  return (
    <section className="space-y-6" aria-label="Kitchen utensil study cards">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-widest text-[#428b19]">Look · Recall · Repeat</p><h2 className="mt-2 text-2xl font-extrabold">{compact ? "Meet your new words" : "Your kitchen, in Caribistani"}</h2></div>
        {!compact && <div className="flex flex-wrap gap-2"><button className={BUTTON} onClick={() => setMode("browse")} aria-pressed={mode === "browse"}>All items</button><button className={BUTTON} onClick={() => restart()} aria-pressed={mode === "cards"}>Flashcards</button></div>}
      </div>
      {mode === "browse" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => <article key={entry.id} className="overflow-hidden rounded-3xl border-2 border-b-4 border-border bg-surface">
            {entry.image.src && <Image src={entry.image.src} alt={entry.image.alt} width={1254} height={1254} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="aspect-square w-full object-contain p-4" />}
            <div className="border-t border-border p-5"><h3 className="text-xl font-extrabold">{entry.word}</h3><p className="mt-1 font-semibold text-[#428b19]">{entry.english}</p><p className="mt-2 text-sm leading-relaxed text-muted">{entry.explanation}</p>{Boolean(entry.acceptedNames?.length) && <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-xs leading-relaxed text-muted">Also called: <span className="font-semibold text-primary">{entry.acceptedNames!.join(", ")}</span></p>}</div>
          </article>)}
        </div>
      ) : (
        <div className="mx-auto max-w-lg space-y-4">
          <div className="flex items-center justify-between text-sm font-bold"><span>{known} of {entries.length} remembered</span><button className="flex items-center gap-1.5 text-muted" onClick={() => restart(true)}><Shuffle className="h-4 w-4" aria-hidden="true" /> Shuffle</button></div>
          <div className="h-3 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-[#58b51d]" style={{ width: `${known / entries.length * 100}%` }} /></div>
          {current ? <>
            <div className="overflow-hidden rounded-3xl border-2 border-b-[6px] border-border bg-surface p-5 text-center">
              <p className="text-sm font-bold text-muted">Look at the item. Say its Caribistani name.</p>
              {current.image.src && <Image src={current.image.src} alt={current.image.alt} width={1254} height={1254} sizes="(max-width: 640px) 100vw, 460px" className="mx-auto aspect-square w-full max-w-xs object-contain" />}
              <div className="min-h-28" aria-live="polite">{revealed ? <><h3 className="text-3xl font-extrabold">{current.word}</h3><p className="mt-2 font-semibold text-[#428b19]">{current.english}</p><p className="mt-2 text-sm leading-relaxed text-muted">{current.explanation}</p>{Boolean(current.acceptedNames?.length) && <p className="mt-3 text-xs text-muted">Also called: {current.acceptedNames!.join(", ")}</p>}</> : <button className={`${BUTTON} w-full`} onClick={() => setRevealed(true)}>Reveal the name <Sparkles className="h-4 w-4" aria-hidden="true" /></button>}</div>
            </div>
            {revealed && <div className="grid grid-cols-2 gap-3"><button className={BUTTON} onClick={() => answer(false)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Show me again</button><button className={`${BUTTON} border-[#428b19] bg-[#e9f7df] text-[#397b13]`} onClick={() => answer(true)}><Check className="h-4 w-4" aria-hidden="true" /> I knew it</button></div>}
            <p className="text-center text-xs leading-relaxed text-muted">Try recalling the name before revealing it. “Show me again” brings this card back.</p>
          </> : <div className="rounded-3xl border-2 border-[#58b51d] bg-[#edf8e6] p-8 text-center"><Check className="mx-auto mb-4 h-10 w-10 text-[#428b19]" aria-hidden="true" /><h3 className="text-2xl font-extrabold">You remembered every item!</h3><button className={`${BUTTON} mt-5`} onClick={() => restart(true)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Practice again</button></div>}
          {onReady && <button onClick={onReady} className="flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-[#3c8d12] bg-[#71d52d] px-6 py-4 font-extrabold text-[#153e09]">Ready? Start the quiz <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>}
        </div>
      )}
    </section>
  );
}
