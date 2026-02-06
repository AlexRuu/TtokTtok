import getQuiz from "@/actions/get-quiz";
import QuizClient from "./components/quiz-client";
import { notFound } from "next/navigation";

const LessonQuizPage = async ({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) => {
  const { lessonSlug } = await params;
  const fetchedQuiz = await getQuiz(`${lessonSlug}-quiz`);

  if (!fetchedQuiz) {
    return notFound();
  }

  return <QuizClient quizSlug={fetchedQuiz.quiz.slug} />;
};

export default LessonQuizPage;
