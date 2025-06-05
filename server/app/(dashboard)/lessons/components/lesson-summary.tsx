import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lesson,
  LessonVersion,
  Quiz,
  Tagging,
  Unit,
  UserChapterReview,
  UserLessonProgress,
  Vocabulary,
} from "@/lib/generated/prisma";
import React from "react";

interface LessonStatsSummaryProps {
  lesson: Lesson & {
    unit: Unit;
    lessonVersion: LessonVersion[];
    tagging: Tagging[];
    quiz: Quiz[];
    vocabulary: Vocabulary[];
    userLessonProgress: UserLessonProgress[];
    userChapterReview: UserChapterReview[];
  };
}

const LessonStatsSummary: React.FC<LessonStatsSummaryProps> = ({ lesson }) => {
  let blocks = { text: 0, image: 0, note: 0, table: 0 };
  const numberOfVocabulary = lesson.vocabulary.length;
  const numberOfQuizzes = lesson.quiz.length;
  const mappedBlocks = JSON.parse(JSON.stringify(lesson.content));
  mappedBlocks.forEach((content: { type: keyof typeof blocks }) => {
    blocks[content.type] = +1;
  });

  const usersStarted = lesson.userLessonProgress.length;
  const usersCompleted = lesson.userLessonProgress.filter(
    (item) => item.completedAt !== null
  ).length;
  const savedByUser = lesson.userChapterReview.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Lesson Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-2">
            Content Blocks
          </h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {(Object.keys(blocks) as (keyof typeof blocks)[]).map((item) => (
              <div key={item} className="flex justify-between">
                <span className="capitalize">{item}</span>
                <span className="font-semibold text-foreground">
                  {blocks[item]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-2">
            Vocabulary and Quizzes
          </h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Vocabulary</span>
              <span className="font-semibold text-foreground">
                {numberOfVocabulary}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quizzes</span>
              <span className="font-semibold text-foreground">
                {numberOfQuizzes}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-2">
            User Stats
          </h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Users Started</span>
              <span className="font-semibold text-foreground">
                {usersStarted}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Users Completed</span>
              <span className="font-semibold text-foreground">
                {usersCompleted}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Completion Rate</span>
              <span className="font-semibold text-foreground">
                {((usersCompleted / usersStarted) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Saved by User</span>
              <span className="font-semibold text-foreground">
                {savedByUser}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonStatsSummary;
