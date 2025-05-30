import React from "react";
import LessonForm from "../components/lesson-form";
import {
  findAscUnits,
  findLessonUnique,
  findTags,
} from "@/prisma/prismaFetches";

const LessonEditPage = async ({ params }: { params: { lessonId: string } }) => {
  const lesson = await findLessonUnique(params.lessonId);
  const units = await findAscUnits();
  const tags = await findTags();
  return (
    <div>
      <LessonForm units={units} tags={tags} initialData={lesson} />
    </div>
  );
};

export default LessonEditPage;
