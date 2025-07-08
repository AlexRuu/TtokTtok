import getUnits from "@/actions/get-units";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Unit } from "@/types";
import Link from "next/link";

const LessonsPage = async () => {
  const units = (await getUnits()) as Unit[];
  console.log(units);
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <div className="w-11/12 mx-auto pt-5">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-[#6B4C3B]">
          Lessons
        </h1>
        <Accordion defaultValue="">
          {units.map((unit) => (
            <AccordionItem
              key={unit.unitNumber}
              value={unit.title}
              title={
                <span className="text-lg sm:text-xl font-medium text-[#6B4C3B]">
                  {unit.unitNumber}. {unit.title}
                </span>
              }
            >
              {unit.lesson.map((lesson) => (
                <Link href={`/lessons/${lesson.slug}`} key={lesson.id}>
                  {lesson.lessonNumber}. {lesson.title}
                </Link>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LessonsPage;
