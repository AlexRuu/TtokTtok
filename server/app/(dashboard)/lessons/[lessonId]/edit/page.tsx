import React from "react";
import LessonForm from "../../components/lesson-form";
import {
  findAscUnits,
  findLessonUnique,
  findTags,
} from "@/prisma/prismaFetches";
import { notFound } from "next/navigation";

const LessonEditPage = async (props: {
  params: Promise<{ lessonId: string }>;
}) => {
  const params = await props.params;
  const lesson = await findLessonUnique(params.lessonId);
  const units = await findAscUnits();
  const tags = await findTags();

  if (!lesson) {
    notFound();
  }

  return (
    <div>
      <LessonForm units={units} tags={tags} initialData={lesson} />
    </div>
  );
};

export default LessonEditPage;
