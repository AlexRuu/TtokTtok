import { notFound } from "next/navigation";
import VocabularyClient from "./components/vocabulary-client";
import getVocabulary from "@/actions/get-vocabulary";

const LessonVocabularyPage = async ({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) => {
  const { lessonSlug } = await params;
  const fetchedVocabulary = await getVocabulary(lessonSlug);

  if (!fetchedVocabulary) {
    return notFound();
  }

  return <VocabularyClient vocabularyList={fetchedVocabulary} />;
};

export default LessonVocabularyPage;
