import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findLessonUnique } from "@/prisma/prismaFetches";

import { notFound } from "next/navigation";
import LessonContent from "../components/lesson-content";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import LessonStatsSummary from "../components/lesson-summary";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import QuizContent from "../components/quiz";
import VocabularyContent from "../components/vocabulary";

const LessonSummaryPage = async (props: {
  params: Promise<{ lessonId: string }>;
}) => {
  const params = await props.params;
  const lesson = await findLessonUnique(params.lessonId);

  if (!lesson) {
    return notFound();
  }

  const lessonUpdateAt = format(lesson.lessonVersion.at(-1)!.createdAt, "PPp");
  const content = JSON.parse(JSON.stringify(lesson.content));
  const vocabulary = lesson.vocabulary;
  const quiz = lesson.quiz;

  return (
    <div className="p-4 sm:p-6 space-y-6 md:p-10">
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-semibold tracking-tight">
              {lesson.title}
            </h1>
            <Button
              variant="outline"
              className="font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 p-4"
            >
              <Link
                href={`/lessons/${lesson.id}/edit`}
                className="flex items-center"
              >
                <Edit className="mr-1" /> Edit
              </Link>
            </Button>
          </div>
          <h2 className="text-lg text-muted-foreground">{lesson.unit.title}</h2>
          <p className="text-base text-muted-foreground">
            Lesson {lesson.lessonNumber}
          </p>
          <p className="text-base text-muted-foreground">
            Version: {lesson.lessonVersion.at(-1)?.version}
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-2 justify-between">
          <div>
            {lesson.tagging.map((tag) => (
              <Badge
                key={tag.tagId}
                className="rounded-full border px-3 py-1 text-xs font-medium mx-1"
                style={{
                  backgroundColor: tag.tag.backgroundColour,
                  color: tag.tag.textColour,
                  borderColor: tag.tag.borderColour,
                }}
              >
                {tag.tag.name}
              </Badge>
            ))}
          </div>
          <div>
            <p className="text-right font-light tracking-tight text-sm text-muted-foreground">
              Last updated: {lessonUpdateAt}
            </p>
          </div>
        </div>
      </section>

      <section className="border shadow-md rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LessonContent content={content} />
            <LessonStatsSummary lesson={lesson} />
            <VocabularyContent vocabulary={vocabulary} />
            <QuizContent quiz={quiz} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LessonSummaryPage;
