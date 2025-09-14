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
}

const QuizClient = ({
  quizId,
  quiz: initialQuiz,
  inProgress = false,
}: QuizClientProps) => {
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(initialQuiz);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const debouncedAnswers = useDebounce(answers, 500);
  const [submitted, setSubmitted] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [loadingNew, setLoadingNew] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loadingNew && quiz) {
      setLoadingNew(false);
    }
  }, [quiz, loadingNew]);

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

  // Save answers to localStorage (debounced)
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
    document.cookie = `quiz-${quizId}-in-progress=true; path=/`;
  }, [debouncedAnswers, quiz, quizId]);

  const handleAnswerChange = (q: QuizQuestion, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleStartNewQuiz = () => {
    localStorage.removeItem(`quiz-${quizId}-attempt`);
    document.cookie = `quiz-${quizId}-in-progress=; path=/; max-age=0`;

    setAnswers({});
    setSubmitted(false);

    router.replace(`/quizzes/${quizId}?t=${Date.now()}`);

    setTimeout(() => {
      router.replace(`/quizzes/${quizId}`, { scroll: false });
    }, 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    localStorage.removeItem(`quiz-${quizId}-attempt`);
    document.cookie = `quiz-${quizId}-in-progress=; path=/; max-age=0`;
  };

  if (isLoading || !quiz || loadingNew) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <Button
        variant="outline"
        className="mb-4 hover:cursor-pointer"
        onClick={handleStartNewQuiz}
      >
        Start New Quiz
      </Button>

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
