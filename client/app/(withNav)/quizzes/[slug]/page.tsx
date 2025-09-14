import getQuiz from "@/actions/get-quiz";
import { Quiz } from "@/types";
import { notFound } from "next/navigation";
import QuizClient from "./[components]/quiz-client";
import { cookies } from "next/headers";

const IndividualQuizPage = async (props: {
  params: Promise<{ slug: string }>;
  searchParams?: { t?: string };
}) => {
  const params = await props.params;
  const { slug } = params;
  const forceNew = Boolean(props.searchParams?.t);

  // Check if current in-progress quiz from cookie
  const cookieStore = await cookies();
  const inProgress =
    cookieStore.get(`quiz-${slug}-in-progress`)?.value === "true" && !forceNew;

  // Only fetch quiz if not in progress
  const quiz: Quiz | null = !inProgress
    ? ((await getQuiz(slug)) as Quiz | null)
    : null;

  if (!quiz && !inProgress) notFound();

  return (
    <div>
      <QuizClient
        quizId={slug}
        quiz={quiz}
        inProgress={inProgress}
        key={props.searchParams?.t || "initial"}
      />
    </div>
  );
};

export default IndividualQuizPage;
