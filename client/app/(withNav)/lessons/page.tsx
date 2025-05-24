import getUnits from "@/actions/get-units";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import React from "react";

const LessonsPage = async () => {
  const units = await getUnits();

  return (
    <div>
      {units.map((unit: { unitNumber: number; title: string }) => (
        <Accordion type="single" key={unit.unitNumber} collapsible>
          <AccordionItem value={unit.title}>
            <AccordionTrigger>
              {unit.unitNumber}. {unit.title}
            </AccordionTrigger>
            <AccordionContent>
              lesson name
              {/* {unit.lesson.map((lesson) => (
                <></>
              ))} */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default LessonsPage;
