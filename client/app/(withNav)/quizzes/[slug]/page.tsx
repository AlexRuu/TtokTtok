import getQuiz from "@/actions/get-quiz";
import { Quiz } from "@/types";
import { notFound } from "next/navigation";
import React from "react";

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

  return <div></div>;
};

export default IndividualQuizPage;
