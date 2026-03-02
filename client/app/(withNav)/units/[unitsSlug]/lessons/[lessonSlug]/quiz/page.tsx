import { notFound } from "next/navigation";
import QuizClient from "./components/quiz-client";

const LessonQuizPage = async ({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) => {
  const { lessonSlug } = await params;

  if (!lessonSlug) {
    notFound();
  }

  return <QuizClient quizSlug={`${lessonSlug}-quiz`} />;
};

export default LessonQuizPage;
