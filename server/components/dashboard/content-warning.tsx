import prismadb from "@/lib/prismadb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const ContentWarning = async () => {
  const units = await prismadb.unit.findMany({ include: { lesson: true } });
  const lessons = await prismadb.lesson.findMany({ include: { quiz: true } });

  const unitsWithoutLessons = units.filter((unit) => unit.lesson.length === 0);
  const lessonsWithoutQuizzes = lessons.filter(
    (lesson) => lesson.quiz.length === 0
  );

  return (
    <Card className="border-yellow-300 bg-yellow-50/40">
      <CardHeader className="flex flex-row items-center space-x-2 text-yellow-700">
        <TriangleAlert className="w-5 h-5 shrink-0" />
        <div>
          <CardTitle className="text-yellow-700">Content Warning</CardTitle>
          <CardDescription className="text-yellow-600">
            These items are missing required content.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Units Without Lessons */}
        <Card className="bg-white border border-yellow-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-yellow-800">
              Units Without Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-yellow-700">
            {unitsWithoutLessons.length === 0 ? (
              <p>All units have lessons ✅</p>
            ) : (
              <div className="flex flex-col">
                {unitsWithoutLessons.map((unit) => (
                  <p key={unit.id}>
                    <span className="font-medium mr-2">
                      Unit {unit.unitNumber}.
                    </span>
                    {unit.title}
                  </p>
                ))}
                <Button
                  asChild
                  className="w-auto ml-auto mt-5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer"
                >
                  <Link href={"/units"}>Go To Units</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lessons Without Quizzes */}
        <Card className="bg-white border border-yellow-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-yellow-800">
              Lessons Without Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-yellow-700">
            {lessonsWithoutQuizzes.length === 0 ? (
              <p>All lessons have quizzes ✅</p>
            ) : (
              <div className="flex flex-col">
                {lessonsWithoutQuizzes.map((lesson) => (
                  <p key={lesson.id}>
                    <span className="font-medium">
                      Lesson {lesson.lessonNumber}
                    </span>
                    : {lesson.title}
                  </p>
                ))}
                <Button
                  asChild
                  className="w-auto ml-auto mt-5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer"
                >
                  <Link href={"/lessons"}>Go To Lessons</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ContentWarning;
