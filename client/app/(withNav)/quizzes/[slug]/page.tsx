import getQuiz from "@/actions/get-quiz";
import { Quiz } from "@/types";
import { notFound } from "next/navigation";
import QuizClient from "./[components]/quiz-client";
import { cookies } from "next/headers";

const IndividualQuizPage = async (props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ t?: string }>;
}) => {
  const params = await props.params;
  const { slug } = params;
  const forceNew = Boolean((await props.searchParams)?.t);

  const cookieStore = await cookies();
  const inProgressCookie =
    cookieStore.get(`quiz-${slug}-in-progress`)?.value === "true";

  // Decide if we should fetch a new quiz
  const shouldFetch = !inProgressCookie || forceNew;

  let quiz: Quiz | null = null;
  let rateLimited = false;

  if (shouldFetch) {
    const result = await getQuiz(slug, inProgressCookie && !forceNew);
    quiz = result.quiz;
    rateLimited = result.rateLimited;
  }

  // If there’s no quiz and nothing is in progress, show 404
  if (!quiz && !inProgressCookie && !rateLimited) notFound();

  return (
    <QuizClient
      quizId={slug}
      quiz={quiz}
      inProgress={inProgressCookie && !forceNew}
      rateLimited={rateLimited}
    />
  );
};

export default IndividualQuizPage;
