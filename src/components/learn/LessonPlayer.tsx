"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageSlot } from "@/components/learn/ImageSlot";
import { GaneshaGuideIcon } from "@/components/learn/GaneshaGuideIcon";
import { KitchenStudy } from "@/components/learn/KitchenStudy";
import { playableQuestions, pendingPictureCount } from "@/lib/learn/catalog";
import { KITCHEN_UTENSILS } from "@/lib/learn/kitchen";
import { matchesVocabularyAnswer } from "@/lib/learn/answers";
import { completeLesson, lessonId, readProgress } from "@/lib/learn/progress";
import type { LearnQuestion, MatchPair, VocabEntry } from "@/lib/learn/types";

type Props = {
  courseSlug: string;
  unitSlug: string;
  lessonSlug: string;
  title: string;
  questions: LearnQuestion[];
  studyEntries?: VocabEntry[];
  backHref: string;
};

const XP_PER_CORRECT = 10;

export function LessonPlayer({
  courseSlug,
  unitSlug,
  lessonSlug,
  title,
  questions,
  studyEntries,
  backHref,
}: Props) {
  const playable = useMemo(() => playableQuestions(questions), [questions]);
  const [queue, setQueue] = useState(() => playable);
  const [studying, setStudying] = useState(Boolean(studyEntries?.length));
  const waiting = pendingPictureCount(questions);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [awardedXp, setAwardedXp] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);

  const question = queue[step];
  const correct = question ? isCorrect(question, picked, pairs) : false;

  function check() {
    if (!question || checked) return;
    if (question.type === "match" && Object.keys(pairs).length < question.pairs.length) return;
    if (question.type !== "match" && !picked?.trim()) return;
    setChecked(true);
    if (isCorrect(question, picked, pairs)) setCorrectCount((count) => count + 1);
    else setQueue((items) => [...items, question]);
  }

  function next() {
    if (step + 1 >= queue.length) {
      const earned = correctCount * XP_PER_CORRECT;
      const previousXp = readProgress().xp;
      const progress = completeLesson(lessonId(courseSlug, unitSlug, lessonSlug), earned);
      setTotalXp(progress.xp);
      setAwardedXp(progress.xp - previousXp);
      setDone(true);
      return;
    }
    setStep((value) => value + 1);
    setPicked(null);
    setChecked(false);
    setPairs({});
    setSelectedWord(null);
    setHintOpen(false);
  }

  if (done) {
    return (
      <section className="animate-rise mx-auto max-w-xl space-y-6 rounded-3xl border-2 border-b-[6px] border-[#58b51d] bg-surface p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Lesson complete</p>
          <GaneshaGuideIcon className="h-24 w-24" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-primary">{title}</h1>
        <p className="text-lg leading-relaxed">
          You recalled all {correctCount} questions, including any you practiced again. {awardedXp} XP added.
        </p>
        <p className="text-muted">Total XP: {totalXp}</p>
        {waiting > 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            {waiting} picture {waiting === 1 ? "question is" : "questions are"} still waiting on reference photographs.
          </p>
        ) : null}
        <Link href={backHref} className="btn-primary inline-flex rounded-full px-5 py-2.5 text-sm">
          Back to the unit
        </Link>
      </section>
    );
  }

  if (studying && studyEntries?.length) {
    return <div className="mx-auto max-w-3xl"><KitchenStudy entries={studyEntries} compact onReady={() => setStudying(false)} /></div>;
  }

  if (!question) {
    return (
      <p className="text-muted">This lesson has no playable questions yet.</p>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted">
          {step >= playable.length ? "Memory boost" : "Picture practice"} · Question {step + 1} of {queue.length}
        </p>
        <div className="h-4 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-label="Lesson progress" aria-valuenow={Math.round(step / queue.length * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-[#58b51d] transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${(step / queue.length) * 100}%` }}
          />
        </div>
        {waiting > 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            Picture matching stays closed until each utensil has its reference photograph. {waiting}{" "}
            {waiting === 1 ? "question is" : "questions are"} waiting.
          </p>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-3">
        <h1 className="min-w-0 font-display text-3xl font-semibold text-primary sm:text-4xl">
          {question.type === "picture-match"
            ? `Which picture is ${question.prompt}?`
            : question.type === "identify-name"
              ? "What is this called?"
              : question.type === "purpose"
                ? `What is ${question.prompt}?`
                : question.type === "type-name" ? "What’s its Caribistani name?" : question.prompt}
        </h1>
      </div>

      <div className="flex items-center gap-3 rounded-3xl border border-[#b9dfd5] bg-[#eff9f5] p-4 text-[#173c4c] sm:gap-5">
        <GaneshaGuideIcon className="h-20 w-20 shrink-0 sm:h-28 sm:w-28" />
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#176c68]">Ganesha · Your learning guide</p>
          <p className="text-sm font-semibold leading-relaxed sm:text-base" role="status">
            {checked ? correct ? "Yes! Another one remembered. Keep going!" : "We’ll come back to this together. Read the answer below before you continue."
              : step >= playable.length ? "Back for another go! Think about the answer you just reviewed."
              : "Take your time. Try remembering it before choosing an answer."}
          </p>
          <p className="text-xs leading-relaxed text-[#47675f]">Practice tips from Bhajan Learn.</p>
          {!checked && <button type="button" onClick={() => setHintOpen(!hintOpen)} aria-expanded={hintOpen} aria-controls="guide-hint" className="rounded-full border border-[#97c9bd] bg-white px-3 py-1.5 text-sm font-bold hover:bg-[#dff1e9]">{hintOpen ? "Hide hint" : "I'm not sure — show a hint"}</button>}
          {!checked && hintOpen && <p id="guide-hint" role="status" className="text-sm leading-relaxed">{question.type === "type-name"
            ? `It starts with “${Array.from(question.answerLabel)[0]}”. Say the name aloud, then try spelling it. Accents aren’t needed.`
            : question.type === "match" ? "Start with the pair you’re most sure of. Select a word on the left, then its meaning on the right."
            : question.type === "picture-match" ? "Look at each object’s shape and material. Picture how you would use it in the kitchen."
            : question.type === "purpose" ? "Picture using this object. Which description fits the job it does?"
            : "Say each option aloud. Which name do you remember learning for this object?"}</p>}
        </div>
      </div>

      {question.type === "identify-name" ? (
        question.image?.src ? <div className="mx-auto w-full max-w-xs"><ImageSlot image={question.image} /></div> : <p className="text-lg leading-relaxed">{question.prompt}</p>
      ) : null}

      {question.type === "type-name" && <form onSubmit={(event) => { event.preventDefault(); if (!checked) check(); }} className="space-y-4">
        <div className="mx-auto w-full max-w-xs"><ImageSlot image={question.image} /></div>
        <label htmlFor="utensil-answer" className="block text-sm font-bold">Type the name</label>
        <input id="utensil-answer" value={picked ?? ""} onChange={(event) => setPicked(event.target.value)} disabled={checked} autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={100} className="w-full rounded-2xl border-2 border-b-4 border-border bg-surface px-5 py-4 text-lg focus:border-[#58b51d]" aria-describedby="spelling-help" />
        <p id="spelling-help" className="text-sm text-muted">No accents needed. Small typos are OK when the word is clear.</p>
      </form>}

      {question.type === "picture-match" ? (
        <ul className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                className="w-full rounded-2xl focus-visible:outline-offset-4"
                aria-pressed={picked === choice.id}
                onClick={() => {
                  if (!checked) setPicked(choice.id);
                }}
              >
                <ImageSlot image={choice.image} selected={picked === choice.id} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {question.type === "identify-name" || question.type === "purpose" ? (
        <ul className="space-y-2">
          {question.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                aria-pressed={picked === choice.id}
                onClick={() => {
                  if (!checked) setPicked(choice.id);
                }}
                className={`w-full rounded-2xl border-2 border-b-4 px-5 py-4 text-left text-base font-semibold transition ${
                  picked === choice.id
                    ? "border-[#58b51d] bg-[#edf8e6]"
                    : "border-border bg-surface hover:border-[#58b51d]"
                }`}
              >
                {choice.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {question.type === "match" ? (
        <MatchBoard
          pairs={question.pairs}
          links={pairs}
          selectedWord={selectedWord}
          locked={checked}
          onSelectWord={setSelectedWord}
          onLink={(wordId, meaningId) => {
            setPairs((current) => ({ ...Object.fromEntries(Object.entries(current).filter(([id, meaning]) => id !== wordId && meaning !== meaningId)), [wordId]: meaningId }));
            setSelectedWord(null);
          }}
        />
      ) : null}

      {checked ? (
        <p className={`animate-rise ${correct ? "text-primary" : "text-danger"}`} role="status">
          {correct
            ? question.type === "type-name" ? `That’s right — ${question.answerLabel}.` : "Correct."
            : question.type === "type-name" ? `The name is ${question.answerLabel}. Take another look — you’ll practice this again.`
            : question.type === "identify-name" || question.type === "purpose"
              ? `Not this time. The answer is: ${
                  question.choices.find((choice) => choice.id === question.answerId)?.label
                }. You’ll try this one again.`
              : question.type === "picture-match"
                ? "Look at the correct picture below. This one will come back for another try."
                : `Match these pairs: ${question.pairs.map((pair) => `${pair.word} — ${pair.meaning}`).join("; ")}. You’ll try these again.`}
        </p>
      ) : null}

      {checked && !correct && question.type === "picture-match" && <div className="max-w-xs"><ImageSlot image={question.choices.find((choice) => choice.id === question.answerId)!.image} /><p className="mt-2 text-center font-bold">{question.prompt}</p></div>}

      <div className="flex gap-3">
        {!checked ? (
          <button type="button" disabled={question.type === "match" ? Object.keys(pairs).length < question.pairs.length : !picked?.trim()} className="w-full rounded-2xl border-b-4 border-[#3c8d12] bg-[#71d52d] px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-[#153e09] disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-muted" onClick={check}>
            Check
          </button>
        ) : (
          <button type="button" className="w-full rounded-2xl border-b-4 border-[#3c8d12] bg-[#71d52d] px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-[#153e09]" onClick={next}>
            {step + 1 >= queue.length ? "Finish" : "Continue"}
          </button>
        )}
      </div>
    </section>
  );
}

function isCorrect(
  question: LearnQuestion,
  picked: string | null,
  pairs: Record<string, string>
) {
  if (question.type === "match") {
    return question.pairs.every((pair) => pairs[pair.id] === pair.id);
  }
  if (question.type === "type-name") return matchesVocabularyAnswer(picked ?? "", question.answerId, KITCHEN_UTENSILS);
  return picked === question.answerId;
}

function MatchBoard({
  pairs,
  links,
  selectedWord,
  locked,
  onSelectWord,
  onLink,
}: {
  pairs: MatchPair[];
  links: Record<string, string>;
  selectedWord: string | null;
  locked: boolean;
  onSelectWord: (id: string | null) => void;
  onLink: (wordId: string, meaningId: string) => void;
}) {
  const meanings = [...pairs].sort((a, b) => a.meaning.localeCompare(b.meaning));
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ul className="space-y-2">
        {pairs.map((pair) => (
          <li key={pair.id}>
            <button
              type="button"
              aria-pressed={selectedWord === pair.id}
              disabled={locked}
              onClick={() => onSelectWord(selectedWord === pair.id ? null : pair.id)}
              className={`w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left ${
                selectedWord === pair.id ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
            >
              {pair.word}
            </button>
          </li>
        ))}
      </ul>
      <ul className="space-y-2">
        {meanings.map((pair) => {
          const linked = Object.entries(links).find(([, meaningId]) => meaningId === pair.id);
          return (
            <li key={pair.id}>
              <button
                type="button"
                disabled={locked || !selectedWord}
                onClick={() => {
                  if (selectedWord) onLink(selectedWord, pair.id);
                }}
                className="w-full rounded-2xl border-2 border-b-4 border-border bg-surface px-4 py-3 text-left disabled:opacity-70"
              >
                {pair.meaning}
                {linked ? <span className="mt-1 block text-sm text-accent">Paired with {pairs.find((word) => word.id === linked[0])?.word}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
