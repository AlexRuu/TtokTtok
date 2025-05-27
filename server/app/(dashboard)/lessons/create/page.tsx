import prismadb from "@/lib/prismadb";
import LessonForm from "../components/lesson-form";

const LessonsPage = async () => {
  const units = await prismadb.unit.findMany({
    orderBy: { unitNumber: "asc" },
  });

  const refinedUnits = units.map((unit) => ({
    unitNumber: unit.unitNumber,
    title: unit.title,
  }));

  return (
    <div>
      <LessonForm units={refinedUnits} />
    </div>
  );
};

export default LessonsPage;
