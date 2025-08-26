"use client";

import { useState } from "react";
import { Quiz, QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MatchingQuiz from "./matching-type";

// Quiz Types
const isMC = (q: QuizQuestion) => q.quizType === "MULTIPLE_CHOICE";
const isTF = (q: QuizQuestion) => q.quizType === "TRUE_FALSE";
const isFIB = (q: QuizQuestion) => q.quizType === "FILL_IN_THE_BLANK";
type AnswerValue = string | Record<string, string> | boolean;

const isMatchingQuestion = (
  q: QuizQuestion
): q is QuizQuestion & { options: { left: string; right: string }[] } =>
  q.quizType === "MATCHING" &&
  Array.isArray(q.options) &&
  q.options.every(
    (o) => typeof o === "object" && o !== null && "left" in o && "right" in o
  );

const QuizPage = ({ quiz }: { quiz: Quiz }) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (q: QuizQuestion, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("Submitted answers:", answers);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      {quiz.quizQuestion.map((q, index) => (
        <Card key={q.id} className="shadow-sm border border-[#FFE4D6] bg-white">
          <CardContent className="p-6 space-y-4">
            <p className="font-medium">
              {index + 1}. {q.question}
            </p>

            {/* MULTIPLE CHOICE */}
            {isMC(q) &&
              Array.isArray(q.options) &&
              (q.options as { option: string; value: string }[]).map(
                (opt, i) => {
                  const currentAnswer = answers[q.id] as string | undefined;
                  const isSelected = currentAnswer === opt.value;

                  return (
                    <Button
                      key={i}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-start rounded-full ${
                        isSelected
                          ? "bg-[#FFE4D6] text-[#5A3F2C]"
                          : "border-[#FFD1B8] text-[#6B4C3B]"
                      }`}
                      onClick={() => handleAnswerChange(q, opt.value)}
                      disabled={submitted}
                    >
                      {opt.option}. {opt.value}
                    </Button>
                  );
                }
              )}

            {/* TRUE/FALSE */}
            {isTF(q) && (
              <div className="flex gap-4">
                {["True", "False"].map((val) => {
                  const currentAnswer = answers[q.id] as string | undefined;
                  const isSelected = currentAnswer === val;

                  return (
                    <Button
                      key={val}
                      variant={isSelected ? "default" : "outline"}
                      className={`flex-1 rounded-full ${
                        isSelected
                          ? "bg-[#FFE4D6] text-[#5A3F2C]"
                          : "border-[#FFD1B8] text-[#6B4C3B]"
                      }`}
                      onClick={() => handleAnswerChange(q, val)}
                      disabled={submitted}
                    >
                      {val}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* FILL IN THE BLANK */}
            {isFIB(q) && (
              <div>
                <Label
                  htmlFor={`fib-${q.id}`}
                  className="text-sm text-[#6B4C3B]"
                >
                  Your Answer
                </Label>
                <Input
                  id={`fib-${q.id}`}
                  placeholder="Type your answer..."
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(q, e.target.value)}
                  disabled={submitted}
                  className="mt-1 border-[#FFD1B8] focus-visible:ring-[#FFB899]"
                />
              </div>
            )}

            {/* MATCHING */}
            {q.quizType === "MATCHING" && isMatchingQuestion(q) && (
              <MatchingQuiz
                question={q}
                disabled={submitted}
                onChange={(matches) => handleAnswerChange(q, matches)}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="bg-[#FFB899] hover:bg-[#FF9E80] text-white rounded-full float-end"
        >
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizPage;
