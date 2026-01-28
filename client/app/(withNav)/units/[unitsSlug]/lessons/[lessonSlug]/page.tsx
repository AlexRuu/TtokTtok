import getLesson from "@/actions/get-lesson";
import LessonContent from "../components/lesson-content";
import type { Lesson, LessonBlock } from "@/types";
import { notFound } from "next/navigation";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) => {
  const { lessonSlug } = await params;
  const lesson = (await getLesson(lessonSlug)) as Lesson;

  if (!lesson) {
    notFound();
  }
  const unit = lesson.unit;
  const lessons = (unit.lessonSummaries ?? []).sort(
    (a, b) => a.lessonNumber - b.lessonNumber,
  );

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessons[currentIndex + 1] ?? null;

  const nextSteps = [];

  // Quiz CTA
  if (lesson.quiz.length > 0) {
    nextSteps.push({
      title: "Take the Quiz",
      description: "Test your understanding of this lesson.",
      href: `/units/${unit.slug}/lessons/${lesson.slug}/quiz`,
    });
  }

  // Vocabulary CTA
  if (lesson.vocabularyList) {
    nextSteps.push({
      title: "Review Vocabulary",
      description: "Go over the key words from this lesson.",
      href: `/units/${unit.slug}/lessons/${lesson.slug}/vocabulary`,
    });
  }

  // Next lesson or unit overview CTA
  if (nextLesson) {
    nextSteps.push({
      title: "Next Lesson",
      description: "Continue your learning journey.",
      href: `/units/${unit.slug}/lessons/${nextLesson.slug}`,
    });
  } else {
    nextSteps.push({
      title: "Back to Lessons",
      description:
        "You’ve completed this unit! Return to the lesson selection page.",
      href: `/units`,
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 pb-20 pt-28 rounded-xl shadow-md">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <header className="mb-6 border-b border-[#E8D7C3] pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide leading-snug">
            {lesson.lessonNumber}. {lesson.title}
          </h1>
          <p className="text-sm text-[#A67C66] mt-1 sm:mt-2 font-medium italic max-w-xs sm:max-w-md">
            Unit {lesson.unit.unitNumber}: {lesson.unit.title}
          </p>
        </header>

        <main className="prose prose-sm sm:prose lg:prose-lg max-w-none scroll-mt-32">
          <LessonContent
            content={lesson.content as LessonBlock[]}
            lessonId={lesson.id}
            nextSteps={nextSteps}
          />
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
