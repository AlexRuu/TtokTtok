import getQuiz from "@/actions/get-quiz";
import QuizClient from "./[components]/quiz-client";

const IndividualQuizPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const { slug } = params;

  // Fetch initial quiz from backend
  const { quiz: initialQuiz, rateLimited } = await getQuiz(slug);

  return (
    <QuizClient
      quizId={slug}
      initialQuiz={initialQuiz ?? null} // may be null
      rateLimited={rateLimited}
    />
  );
};

export default IndividualQuizPage;
