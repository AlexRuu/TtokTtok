import getLesson from "@/actions/get-lesson";
import LessonContent from "../components/lesson-content";
import type { Lesson, LessonBlock } from "@/types";
import { notFound } from "next/navigation";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const lesson = (await getLesson(slug)) as Lesson;

  if (!lesson) {
    notFound();
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
          <LessonContent content={lesson.content as LessonBlock[]} />
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
