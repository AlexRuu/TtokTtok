import { findLessons, findUniqueQuiz } from "@/prisma/prismaFetches";
import QuizForm from "../components/quiz-form";

const EditQuizPage = async (props: { params: Promise<{ quizId: string }> }) => {
  const params = await props.params;
  const quiz = await findUniqueQuiz(params.quizId);
  const lessons = await findLessons();

  return (
    <div>
      <QuizForm initialData={quiz} lessons={lessons} />
    </div>
  );
};

export default EditQuizPage;
