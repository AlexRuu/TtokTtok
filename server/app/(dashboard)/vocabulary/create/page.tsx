import { findLessons } from "@/prisma/prismaFetches";
import VocabularyForm from "../components/vocabulary-form";

const CreateVocabularyPage = async () => {
  const lessons = await findLessons();

  return (
    <div>
      <VocabularyForm initialData={null} lessons={lessons} />
    </div>
  );
};

export default CreateVocabularyPage;
