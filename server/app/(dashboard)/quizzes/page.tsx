import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findAscUnits } from "@/prisma/prismaFetches";
import { Edit } from "lucide-react";

import Link from "next/link";

const QuizzesPage = async () => {
  const units = await findAscUnits();

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Overview of all your created quizzes by Unit/Lessons
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
        >
          <Link href="/quizzes/create">+ Create Quiz</Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <Accordion type="multiple">
            {units.map((unit) => (
              <AccordionItem value={unit.id} key={unit.id}>
                <AccordionTrigger>
                  Unit {unit.unitNumber} - {unit.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {unit.lesson.map((lesson) => (
                      <Card
                        key={lesson.id}
                        className="border border-muted bg-background shadow-sm rounded-2xl"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-semibold">
                            Lesson {lesson.lessonNumber} - {lesson.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="multiple">
                            {lesson.quiz.map((item, index) => (
                              <AccordionItem value={item.id} key={item.id}>
                                <AccordionTrigger>
                                  Quiz #{index + 1}
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col">
                                  <Card>
                                    <CardHeader className="flex justify-between items-center">
                                      <CardTitle className="text-xl">
                                        Quiz Questions
                                      </CardTitle>
                                      <Button
                                        asChild
                                        className="w-1/4 mb-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
                                      >
                                        <Link href={`/quizzes/${item.id}`}>
                                          <Edit /> Edit Quiz
                                        </Link>
                                      </Button>
                                    </CardHeader>
                                    <CardContent>
                                      {item.quizQuestion.map(
                                        (question, index) => {
                                          let parsedOptions: any[] = [];

                                          if (question.options) {
                                            try {
                                              const json =
                                                typeof question.options ===
                                                "string"
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
                                              className="border rounded-md p-3 space-y-2 bg-muted mb-2"
                                            >
                                              <div className="flex justify-between items-start">
                                                <p className="font-semibold">
                                                  Q{index + 1}:{" "}
                                                  {question.question}
                                                </p>
                                                <Badge
                                                  variant="secondary"
                                                  className="text-xs"
                                                >
                                                  {question.quizType}
                                                </Badge>
                                              </div>

                                              {question.quizType === "MATCHING"
                                                ? (() => {
                                                    let matchingPairs: {
                                                      left: string;
                                                      right: string;
                                                    }[] = [];
                                                    try {
                                                      // Parse options if it's a JSON string, otherwise use as is
                                                      const parsed =
                                                        typeof question.options ===
                                                        "string"
                                                          ? JSON.parse(
                                                              question.options
                                                            )
                                                          : question.options;

                                                      if (
                                                        Array.isArray(parsed)
                                                      ) {
                                                        matchingPairs =
                                                          parsed as {
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

                                                    return matchingPairs.length >
                                                      0 ? (
                                                      <ul className="list-none list-inside mt-1 space-y-1">
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
                                                      <span>
                                                        No matching pairs found.
                                                      </span>
                                                    );
                                                  })()
                                                : parsedOptions.length > 0 && (
                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                      {parsedOptions.map(
                                                        (opt, i) => {
                                                          if (
                                                            typeof opt ===
                                                              "object" &&
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
                                                            <li key={i}>
                                                              {String(opt)}
                                                            </li>
                                                          );
                                                        }
                                                      )}
                                                    </ul>
                                                  )}

                                              <div className="text-sm text-green-600">
                                                <span className="font-medium">
                                                  Answer:
                                                </span>
                                                {question.quizType ===
                                                "MATCHING" ? (
                                                  (() => {
                                                    let parsedAnswer: {
                                                      left: string;
                                                      match: string;
                                                    }[] = [];

                                                    try {
                                                      parsedAnswer =
                                                        Array.isArray(
                                                          question.answer
                                                        )
                                                          ? question.answer
                                                          : JSON.parse(
                                                              question.answer
                                                            );
                                                    } catch (e) {
                                                      return (
                                                        <span className="text-red-500">
                                                          Invalid matching data
                                                        </span>
                                                      );
                                                    }

                                                    return (
                                                      <ul className="list-none list-inside mt-1 space-y-1">
                                                        {parsedAnswer.map(
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
                                                                {pair.match}
                                                              </span>
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    );
                                                  })()
                                                ) : (
                                                  <span>
                                                    {String(question.answer)}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </CardContent>
                                  </Card>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzesPage;
