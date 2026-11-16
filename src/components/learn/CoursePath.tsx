import Link from "next/link";
import { BookOpen, Flag, LockKeyhole, Star } from "lucide-react";
import type { LearnUnit } from "@/lib/learn/types";

const OFFSETS = ["translate-x-0", "translate-x-10 sm:translate-x-14", "translate-x-14 sm:translate-x-20", "translate-x-6 sm:translate-x-10", "-translate-x-6 sm:-translate-x-10", "-translate-x-10 sm:-translate-x-14"];

export function CoursePath({ units, courseHref }: { units: LearnUnit[]; courseHref: string }) {
  const ordered = [...units].sort((a, b) => Number(b.lessons.length > 0) - Number(a.lessons.length > 0) || a.order - b.order);
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-surface px-4 py-8 sm:px-8">
      <div className="mb-10 flex items-center justify-between gap-3 rounded-2xl border-b-4 border-[#3c8d12] bg-[#71d52d] p-5 text-[#153e09]">
        <div><p className="text-xs font-extrabold uppercase tracking-widest">Section 1 · Beginner</p><h3 className="mt-1 text-xl font-extrabold">Make yourself at home</h3></div>
        <BookOpen className="h-8 w-8 shrink-0" aria-hidden="true" />
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute bottom-20 left-1/2 top-12 border-l-4 border-dashed border-[#e6e5df]" />
      <ol className="relative mx-auto flex max-w-sm flex-col items-center gap-8 pb-8">
        {ordered.map((unit, index) => {
          const available = unit.lessons.length > 0;
          const nodeClass = `relative flex h-20 w-24 items-center justify-center rounded-[50%] border-b-[7px] transition ${available ? "border-[#3c8d12] bg-[#58b51d] text-white hover:brightness-110 active:translate-y-1 active:border-b-[3px]" : "border-[#d0cfc8] bg-[#e9e8e1] text-[#9b9b91]"}`;
          return (
            <li key={unit.slug} className={`relative z-10 flex w-52 flex-col items-center text-center ${OFFSETS[index % OFFSETS.length]}`}>
              {available && <span className="mb-3 rounded-xl border-2 border-[#58b51d] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#428b19]">Start here!</span>}
              {available ? (
                <Link href={`${courseHref}/${unit.slug}`} aria-label={`Start ${unit.title}`} className={nodeClass}><Star className="h-9 w-9 fill-white" aria-hidden="true" /></Link>
              ) : (
                <div className={nodeClass} aria-hidden="true"><LockKeyhole className="h-7 w-7" /></div>
              )}
              <h4 className={`mt-3 text-sm font-extrabold ${available ? "text-[#397b13]" : "text-muted"}`}>{unit.title}</h4>
              <p className="mt-1 text-xs text-muted">{available ? "Names · Matching · Practice" : "Coming soon"}</p>
            </li>
          );
        })}
        <li className="relative z-10 flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-surface p-5 text-muted"><Flag className="mb-2 h-7 w-7 text-accent" aria-hidden="true" /><p className="text-sm font-bold">More adventures ahead</p><p className="mt-1 text-xs">One word at a time.</p></li>
      </ol>
      </div>
    </div>
  );
}
