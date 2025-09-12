import getQuiz from "@/actions/get-quiz";
import { Quiz } from "@/types";
import { notFound } from "next/navigation";
import React from "react";
import QuizClient from "./[components]/quiz-client";
import { cookies } from "next/headers";

const IndividualQuizPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = params;

  // Check if current in-progress quiz from cookie
  const cookieStore = await cookies();
  const inProgress =
    cookieStore.get(`quiz-${slug}-in-progress`)?.value === "true";

  // Only fetch quiz if not in progress
  const quiz: Quiz | null = !inProgress
    ? ((await getQuiz(slug)) as Quiz | null)
    : null;
  if (!quiz && !inProgress) notFound();

  return (
    <div>
      <QuizClient quizId={slug} quiz={quiz} inProgress={inProgress} />
    </div>
  );
};

export default IndividualQuizPage;
