import { findQuizzes } from "@/prisma/prismaFetches";

const QuizzesPage = async () => {
  const quizzes = await findQuizzes();

  return <div>QuizzesPage</div>;
};

export default QuizzesPage;
