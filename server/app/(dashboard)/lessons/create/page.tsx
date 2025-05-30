import prismadb from "@/lib/prismadb";
import LessonForm from "../components/lesson-form";

const LessonsPage = async () => {
  const units = await prismadb.unit.findMany({
    orderBy: { unitNumber: "asc" },
  });

  const tags = await prismadb.tag.findMany({});

  return (
    <div>
      <LessonForm units={units} tags={tags} initialData={null} />
    </div>
  );
};

export default LessonsPage;
