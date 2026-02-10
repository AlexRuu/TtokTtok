import { notFound } from "next/navigation";
import VocabularyClient from "./components/vocabulary-client";
import getVocabulary from "@/actions/get-vocabulary";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params;
  const fetchedVocabulary = await getVocabulary(lessonSlug);

  return {
    title: fetchedVocabulary.title,
    description: `${fetchedVocabulary.title} vocabulary page`,
  };
}

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
