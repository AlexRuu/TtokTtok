import getUnits from "@/actions/get-units";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

const LessonsPage = async () => {
  const units = await getUnits();

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <div className="w-11/12 mx-auto pt-5">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-[#6B4C3B]">
          Lessons
        </h1>
        <Accordion defaultValue="">
          {units.map((unit: { unitNumber: number; title: string }) => (
            <AccordionItem
              key={unit.unitNumber}
              value={unit.title}
              title={
                <span className="text-lg sm:text-xl font-medium text-[#6B4C3B]">
                  {unit.unitNumber}. {unit.title}
                </span>
              }
            >
              {unit.unitNumber}. {unit.title}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LessonsPage;
