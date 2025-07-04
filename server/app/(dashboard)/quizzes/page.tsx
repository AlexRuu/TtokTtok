import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "@/components/ui/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findAscUnits } from "@/prisma/prismaFetches";
import { Edit, Ellipsis } from "lucide-react";
import Link from "next/link";

const QuizzesPage = async () => {
  const units = await findAscUnits();

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pink-800">
            Quizzes
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md">
            Overview of all your created quizzes by Unit/Lessons
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
        >
          <Link href="/quizzes/create">+ Create Quiz</Link>
        </Button>
      </div>

      {/* Accordion of Units */}
      <Accordion type="multiple" className="space-y-6">
        {units.map((unit) => (
          <AccordionItem
            key={unit.id}
            value={unit.id}
            className="rounded-xl border border-pink-200 bg-white shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="text-left px-5 py-4 text-lg font-semibold text-pink-800 bg-pink-50 hover:bg-pink-100 transition-colors rounded-t-xl">
              Unit {unit.unitNumber} - {unit.title}
            </AccordionTrigger>
            <AccordionContent className="bg-white px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {unit.lesson.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="rounded-2xl border border-muted bg-background shadow-sm hover:shadow-md transition"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex justify-between items-center text-foreground">
                        Lesson {lesson.lessonNumber} - {lesson.title}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="Open actions menu"
                              className="h-8 w-8 p-0 rounded-md flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors duration-200"
                            >
                              <Ellipsis className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="center"
                            sideOffset={4}
                            className="w-40 bg-white border border-pink-200 rounded-lg shadow-md p-2"
                          >
                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-indigo-700 text-sm rounded-md hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300"
                            >
                              <Link
                                href={`/quiz/${lesson.quiz[0]?.id || ""}`}
                                tabIndex={-1}
                                className="flex items-center gap-2 w-full"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm rounded-md hover:bg-red-100 focus:ring-2 focus:ring-red-300"
                            >
                              <DeleteButton
                                path="quiz"
                                title="Delete Quiz?"
                                id={lesson.quiz[0]?.id || ""}
                                minimal
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Quiz Questions List */}
                      {lesson.quiz.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">
                          No quizzes yet.
                        </p>
                      ) : (
                        <Accordion type="multiple" className="space-y-3">
                          {lesson.quiz.map((quizItem, index) => (
                            <AccordionItem
                              key={quizItem.id}
                              value={quizItem.id}
                              className="rounded-lg border border-pink-200 border-b-0 last:border-b border-b-pink-200 bg-pink-50"
                            >
                              <AccordionTrigger className="px-4 py-2 text-sm font-medium text-pink-700 rounded-md hover:bg-pink-100 focus:bg-pink-100 focus:ring-2 focus:ring-pink-300">
                                Quiz #{index + 1}
                              </AccordionTrigger>
                              <AccordionContent className="p-4 space-y-4">
                                {quizItem.quizQuestion.map((question, idx) => {
                                  let parsedOptions: any[] = [];

                                  if (question.options) {
                                    try {
                                      const json =
                                        typeof question.options === "string"
                                          ? JSON.parse(question.options)
                                          : question.options;

                                      if (Array.isArray(json)) {
                                        parsedOptions = json;
                                      }
                                    } catch (e) {
                                      console.warn(
                                        `Failed to parse options for question ${question.id}`
                                      );
                                    }
                                  }

                                  return (
                                    <div
                                      key={question.id}
                                      className="border border-pink-200 rounded-md p-3 space-y-2 bg-pink-50"
                                    >
                                      <div className="flex justify-between items-start">
                                        <p className="font-semibold text-pink-800">
                                          Q{idx + 1}: {question.question}
                                        </p>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {question.quizType}
                                        </Badge>
                                      </div>

                                      {/* Options */}
                                      {question.quizType === "MATCHING"
                                        ? (() => {
                                            let matchingPairs: {
                                              left: string;
                                              right: string;
                                            }[] = [];
                                            try {
                                              const parsed =
                                                typeof question.options ===
                                                "string"
                                                  ? JSON.parse(question.options)
                                                  : question.options;

                                              if (Array.isArray(parsed)) {
                                                matchingPairs = parsed as {
                                                  left: string;
                                                  right: string;
                                                }[];
                                              }
                                            } catch (e) {
                                              console.warn(
                                                `Failed to parse matching pairs for question ${question.id}`,
                                                e
                                              );
                                            }

                                            return matchingPairs.length > 0 ? (
                                              <ul className="list-none list-inside mt-1 space-y-1 text-pink-700">
                                                {matchingPairs.map(
                                                  (pair, i) => (
                                                    <li
                                                      key={i}
                                                      className="flex space-x-2"
                                                    >
                                                      <span className="font-medium w-32 truncate">
                                                        {pair.left}
                                                      </span>
                                                      <span className="w-6 text-center">
                                                        →
                                                      </span>
                                                      <span className="flex-1 truncate">
                                                        {pair.right}
                                                      </span>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            ) : (
                                              <span className="text-pink-600">
                                                No matching pairs found.
                                              </span>
                                            );
                                          })()
                                        : parsedOptions.length > 0 && (
                                            <ul className="list-disc list-inside text-sm space-y-1 text-pink-800">
                                              {parsedOptions.map((opt, i) => {
                                                if (
                                                  typeof opt === "object" &&
                                                  "option" in opt &&
                                                  "value" in opt
                                                ) {
                                                  return (
                                                    <li
                                                      key={i}
                                                      className="list-none"
                                                    >
                                                      <span className="font-medium">
                                                        {opt.option}.
                                                      </span>
                                                      {opt.value}
                                                    </li>
                                                  );
                                                }
                                                return (
                                                  <li key={i}>{String(opt)}</li>
                                                );
                                              })}
                                            </ul>
                                          )}

                                      {/* Answer */}
                                      <div className="text-sm text-green-600">
                                        <span className="font-medium">
                                          Answer:{" "}
                                        </span>
                                        {question.quizType === "MATCHING" ? (
                                          (() => {
                                            let parsedAnswer: {
                                              left: string;
                                              match: string;
                                            }[] = [];

                                            try {
                                              parsedAnswer = Array.isArray(
                                                question.answer
                                              )
                                                ? question.answer
                                                : JSON.parse(question.answer);
                                            } catch (e) {
                                              return (
                                                <span className="text-red-500">
                                                  Invalid matching data
                                                </span>
                                              );
                                            }

                                            return (
                                              <ul className="list-none list-inside mt-1 space-y-1 text-pink-700">
                                                {parsedAnswer.map((pair, i) => (
                                                  <li
                                                    key={i}
                                                    className="flex space-x-2"
                                                  >
                                                    <span className="font-medium w-32 truncate">
                                                      {pair.left}
                                                    </span>
                                                    <span className="w-6 text-center">
                                                      →
                                                    </span>
                                                    <span className="flex-1 truncate">
                                                      {pair.match}
                                                    </span>
                                                  </li>
                                                ))}
                                              </ul>
                                            );
                                          })()
                                        ) : (
                                          <span>{String(question.answer)}</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default QuizzesPage;
