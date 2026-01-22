import QuizForm from "../components/quiz-form";
import { findLessons } from "@/prisma/prismaFetches";

const CreateQuiz = async () => {
  const lessons = await findLessons();

  return (
    <div>
      <QuizForm initialData={null} lessons={lessons} />
    </div>
  );
};

export default CreateQuiz;
