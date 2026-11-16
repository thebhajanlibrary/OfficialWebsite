import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { getLearnCategory, getLesson } from "@/lib/learn/catalog";

type Props = {
  params: Promise<{ category: string; course: string; unit: string; lesson: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, unit, lesson } = await params;
  const found = getLesson(course, unit, lesson);
  return { title: found ? found.lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const { category: categorySlug, course: courseSlug, unit: unitSlug, lesson: lessonSlug } =
    await params;
  const category = getLearnCategory(categorySlug);
  const found = getLesson(courseSlug, unitSlug, lessonSlug);
  if (!category || !found || found.course.categorySlug !== category.slug) notFound();
  const { course, unit, lesson } = found;
  const backHref = `/learn/${category.slug}/${course.slug}/${unit.slug}`;

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        <Link href={backHref} className="hover:text-primary">
          {unit.title}
        </Link>
      </p>
      <LessonPlayer
        courseSlug={course.slug}
        unitSlug={unit.slug}
        lessonSlug={lesson.slug}
        title={lesson.title}
        questions={lesson.questions}
        studyEntries={lesson.studyEntries}
        backHref={backHref}
      />
    </div>
  );
}
