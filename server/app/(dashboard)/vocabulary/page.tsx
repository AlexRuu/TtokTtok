import { findLessons } from "@/prisma/prismaFetches";

const VocabularyPage = async () => {
  const lessons = await findLessons();

  return (
    <div>
      {lessons.map((lesson) => (
        <div key={lesson.id}></div>
      ))}
    </div>
  );
};

export default VocabularyPage;
