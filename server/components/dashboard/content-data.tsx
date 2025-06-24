import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  getTopStartedLessons,
  getTopCompletedLessons,
  getTopAttemptedQuizzes,
  getIncompletedLessons,
} from "@/actions/dashboard-actions";

const ContentData = async () => {
  const topStartedLessons = await getTopStartedLessons();
  const topCompletedLessons = await getTopCompletedLessons();
  const topAttemptedQuizzes = await getTopAttemptedQuizzes();
  const incompletedLessons = await getIncompletedLessons();

  return (
    <Card className="bg-[#FFF9F5] text-[#6B4C3B] shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Lesson & Quiz Stats</CardTitle>
        <CardDescription>
          Overview of activity trends in your content
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Started Lessons */}
        <Card className="bg-white dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base">Top Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topStartedLessons.map((lesson) => (
              <div key={lesson.title}>
                <p className="font-medium">
                  Unit {lesson.unitNumber} – {lesson.lessonNumber}.{" "}
                  {lesson.title}
                </p>
                <p className="text-muted-foreground">
                  Started by {lesson.count} user{lesson.count !== 1 && "s"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Completed Lessons */}
        <Card className="bg-white dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base">Top Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topCompletedLessons.map((lesson) => (
              <div key={lesson.title}>
                <p className="font-medium">
                  Unit {lesson.unitNumber} – {lesson.lessonNumber}.{" "}
                  {lesson.title}
                </p>
                <p className="text-muted-foreground">
                  Completed by {lesson.count} user{lesson.count !== 1 && "s"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Attempted Quizzes */}
        <Card className="bg-white dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base">Top Attempted Quizzes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topAttemptedQuizzes.map((quiz) => (
              <div key={quiz.id}>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-muted-foreground">
                  Attempted {quiz.attemptCount} time
                  {quiz.attemptCount !== 1 && "s"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Incompleted Lessons */}
        <Card className="bg-white dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base">Top Lessons Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {incompletedLessons.map((lesson) => (
              <div key={lesson.id}>
                <p className="font-medium">
                  Lesson {lesson.lessonNumber}: {lesson.title}
                </p>
                <p className="text-muted-foreground">
                  {lesson.incompleteCount} user
                  {lesson.incompleteCount !== 1 && "s"} still progressing
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ContentData;
