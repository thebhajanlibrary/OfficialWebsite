import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight, BookOpen, Globe2, Sparkles } from "lucide-react";
import { LearnMascot } from "@/components/learn/LearnMascot";
import { LearnXp } from "@/components/learn/LearnXp";
import { CoursePath } from "@/components/learn/CoursePath";
import { CourseProgress } from "@/components/learn/CourseProgress";
import { getCourse, getLearnCategory } from "@/lib/learn/catalog";
import { lessonId } from "@/lib/learn/progress";

type Props = { params: Promise<{ category: string; course: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  return { title: course ? course.title : "Course" };
}

export default async function CoursePage({ params }: Props) {
  const { category: categorySlug, course: courseSlug } = await params;
  const category = getLearnCategory(categorySlug);
  const course = getCourse(courseSlug);
  if (!category || !course || course.categorySlug !== category.slug) notFound();

  const ready = course.units.filter((unit) => unit.lessons.length > 0).length;
  const firstUnit = course.units.find((unit) => unit.lessons.length > 0);
  const courseHref = `/learn/${category.slug}/${course.slug}`;
  const isCaribistani = course.slug === "caribistani";

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
        {" · "}
        <Link href={`/learn/${category.slug}`} className="hover:text-primary">
          {category.title}
        </Link>
      </p>
      <header className="overflow-hidden rounded-3xl bg-[#123e35] text-[#fffaf0] shadow-xl shadow-[#123e35]/10">
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14">
            <p className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e7c27a]">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Bhajan Learn · Language & heritage
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl xl:text-7xl">
              {isCaribistani ? "Caribistani" : course.title}
            </h1>
            {isCaribistani && <p className="mt-3 font-display text-2xl text-[#e7c27a]">Caribbean Hindustani</p>}
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
              {isCaribistani
                ? "Connect with the language of home. Explore the everyday words, traditions, and sounds of our Caribbean heritage."
                : course.summary}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {firstUnit && (
                <Link href={`${courseHref}/${firstUnit.slug}`} className="inline-flex items-center gap-3 rounded-2xl border-b-4 border-[#38920b] bg-[#71d52d] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#153e09] transition hover:bg-[#8ae447] active:translate-y-1 active:border-b-0">
                  Start learning <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <a href="#course-units" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-medium transition hover:bg-white/10">
                Explore units <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/65">
              <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Beginner friendly</span>
              <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> {course.region}</span>
            </div>
          </div>
          {course.cover && (
            <div className="relative self-center lg:p-5 lg:pl-0">
              <Image src={course.cover.src} alt={course.cover.alt} width={1254} height={1254} sizes="(max-width: 1024px) 100vw, 50vw" preload className="aspect-square w-full object-contain lg:rounded-2xl" />
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-border bg-surface px-6 py-5">
          <div><p className="text-2xl font-semibold">{course.units.length}</p><p className="text-xs text-muted">Units to explore</p></div>
          <div><p className="text-2xl font-semibold">{ready}</p><p className="text-xs text-muted">Ready to practice</p></div>
          <div className="border-l border-border pl-6"><Sparkles className="mb-2 h-4 w-4 text-accent" aria-hidden="true" /><LearnXp /></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-accent-soft px-5 py-3 lg:max-w-xs">
          <LearnMascot mood="idle" decorative className="h-20 w-20 shrink-0" />
          <p className="text-sm leading-relaxed"><span className="block font-semibold">A little practice, every day.</span><span className="text-muted">Mor is here to keep you company.</span></p>
        </div>
      </div>

      <section id="course-units" className="scroll-mt-24 space-y-6" aria-labelledby="units-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Your learning path</p><h2 id="units-heading" className="font-display text-3xl font-semibold sm:text-4xl">Small steps. A deeper connection.</h2></div>
          <p className="text-sm text-muted">{ready} available · {course.units.length - ready} coming soon</p>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">Begin with traditional kitchen utensils. More units and levels will open as verified vocabulary is added.</p>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <CoursePath units={course.units} courseHref={courseHref} />
          <aside className="space-y-5 lg:sticky lg:top-24">
            <CourseProgress lessonIds={course.units.flatMap((unit) => unit.lessons.map((lesson) => lessonId(course.slug, unit.slug, lesson.slug)))} />
            <div className="rounded-3xl border-2 border-border border-b-4 bg-accent-soft p-6 text-center">
              <LearnMascot mood="idle" decorative className="mx-auto h-32 w-32" />
              <h3 className="mt-2 text-lg font-extrabold">You’ve got this!</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">A few words today. A stronger connection tomorrow. Mor is cheering you on.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
