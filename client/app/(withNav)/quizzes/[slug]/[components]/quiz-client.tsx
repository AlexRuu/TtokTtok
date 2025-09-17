"use client";

import { useEffect, useState } from "react";
import { Quiz, QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MatchingQuiz from "./matching-type";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import useDebounce from "@/hooks/debounce";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Quiz Types helpers
const isMC = (q: QuizQuestion) => q.quizType === "MULTIPLE_CHOICE";
const isTF = (q: QuizQuestion) => q.quizType === "TRUE_FALSE";
const isFIB = (q: QuizQuestion) => q.quizType === "FILL_IN_THE_BLANK";

type AnswerValue = string | Record<string, string> | boolean;

interface CurrentAttempt {
  quiz: Quiz;
  answers: Record<string, AnswerValue>;
}

const isMatchingQuestion = (
  q: QuizQuestion
): q is QuizQuestion & { options: { left: string; right: string }[] } =>
  q.quizType === "MATCHING" &&
  Array.isArray(q.options) &&
  q.options.every(
    (o) => typeof o === "object" && o !== null && "left" in o && "right" in o
  );

interface QuizClientProps {
  quizId: string;
  quiz?: Quiz | null;
  inProgress?: boolean;
  rateLimited?: boolean;
}

const QuizClient = ({
  quizId,
  quiz: initialQuiz,
  inProgress = false,
  rateLimited = false,
}: QuizClientProps) => {
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(initialQuiz);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const debouncedAnswers = useDebounce(answers, 500);
  const [submitted, setSubmitted] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const router = useRouter();

  useEffect(() => {
    if (rateLimited) {
      toast.error(
        "You’re starting quizzes too quickly. Please wait a few minutes.",
        {
          style: {
            background: "#FFF9F5",
            color: "#6B4C3B",
            borderRadius: "12px",
            padding: "14px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            fontSize: "15px",
            border: "1px solid #FFD1B8",
          },
          className:
            "transition-all transform duration-300 ease-in-out font-medium",
        }
      );
      router.replace(`/quizzes/${quizId}`, { scroll: false });
      stopLoading();
      return;
    }

    if (initialQuiz) {
      setQuiz(initialQuiz);
      setAnswers({});
      setSubmitted(false);
      localStorage.removeItem(`quiz-${quizId}-attempt`);

      router.replace(`/quizzes/${quizId}`, { scroll: false });
      stopLoading();
    }
  }, [initialQuiz, quizId, router, stopLoading, rateLimited]);

  // Hydrate saved attempt from localStorage if inProgress
  useEffect(() => {
    if (!quiz && inProgress) {
      startLoading();
      const saved = localStorage.getItem(`quiz-${quizId}-attempt`);
      if (saved) {
        const parsed: CurrentAttempt = JSON.parse(saved);
        setQuiz(parsed.quiz);
        setAnswers(parsed.answers || {});
      }
      stopLoading();
    }
  }, [quiz, inProgress, quizId, startLoading, stopLoading]);

  // Save answers to localStorage
  useEffect(() => {
    if (!quiz) return;

    const attemptToSave: CurrentAttempt = {
      quiz,
      answers: debouncedAnswers,
    };

    localStorage.setItem(
      `quiz-${quizId}-attempt`,
      JSON.stringify(attemptToSave)
    );
  }, [debouncedAnswers, quiz, quizId]);

  const handleAnswerChange = (q: QuizQuestion, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleStartNewQuiz = () => {
    startLoading();
    router.replace(`/quizzes/${quizId}?t=${Date.now()}`);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    localStorage.removeItem(`quiz-${quizId}-attempt`);
    document.cookie = `quiz-${quizId}-in-progress=; path=/; max-age=0`;
  };

  if (isLoading || !quiz) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="hover:cursor-pointer border-[#FFD1B8] text-[#6B4C3B] hover:bg-[#FFE4D6] rounded-full px-6"
          onClick={handleStartNewQuiz}
        >
          Start New Quiz
        </Button>
      </div>

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
                  const isSelected = answers[q.id] === opt.value;
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
                  const isSelected = answers[q.id] === val;
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
                value={answers[q.id] as Record<string, string>}
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

export default QuizClient;
