import getQuiz from "@/actions/get-quiz";
import { Quiz } from "@/types";
import { notFound } from "next/navigation";
import React from "react";
import QuizClient from "./[components]/quiz-client";

const IndividualQuizPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const quiz = (await getQuiz(slug)) as Quiz | null;

  if (!quiz) {
    notFound();
  }

  return (
    <div>
      <QuizClient quiz={quiz} />
    </div>
  );
};

export default IndividualQuizPage;
