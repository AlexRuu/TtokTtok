import QuizClient from "./[components]/quiz-client";
import getQuizMetadata from "@/actions/get-quiz-metadata";
import { notFound } from "next/navigation";

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const { metadata } = await getQuizMetadata(params.slug);

  if (!metadata) {
    return {
      title: "Quiz Not Found",
      description: "The requested quiz could not be found.",
    };
  }

  return {
    title: metadata.title,
    description: `Take the quiz "${metadata.title}" on TtokTtok!`,
  };
};

const IndividualQuizPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const { slug } = params;

  // Fetch initial quiz from backend
  const { metadata, error } = await getQuizMetadata(slug);

  if (error || !metadata) {
    return notFound();
  }

  return <QuizClient quizId={slug} />;
};

export default IndividualQuizPage;
