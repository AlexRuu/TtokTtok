import React from "react";
import VocabularyForm from "../components/vocabulary-form";
import { findLessons, findUniqueVocabulary } from "@/prisma/prismaFetches";

export const revalidate = 0;

const VocabularyEdit = async (props: {
  params: Promise<{ vocabularyListId: string }>;
}) => {
  const params = await props.params;
  const lessons = await findLessons();
  const vocabulary = await findUniqueVocabulary(params.vocabularyListId);
  return (
    <div>
      <VocabularyForm initialData={vocabulary} lessons={lessons} />
    </div>
  );
};

export default VocabularyEdit;
