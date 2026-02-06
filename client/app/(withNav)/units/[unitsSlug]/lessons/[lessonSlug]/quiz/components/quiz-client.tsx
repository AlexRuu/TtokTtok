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
import toast from "react-hot-toast";
import getQuiz from "@/actions/get-quiz";
import postQuizResult from "@/actions/post-quiz-submission";
import { QuizResults } from "./quiz-results";
import { formatTime } from "@/lib/utils";
import { QuizCooldown } from "./countdown";

// Quiz type helpers
const isMC = (q: QuizQuestion) => q.quizType === "MULTIPLE_CHOICE";
const isTF = (q: QuizQuestion) => q.quizType === "TRUE_FALSE";
const isFIB = (q: QuizQuestion) => q.quizType === "FILL_IN_THE_BLANK";

type AnswerValue = string | Record<string, string> | boolean;

interface QuizResultItem {
  questionId: string;
  question: string;
  quizType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK" | "MATCHING";
  givenAnswer: string | boolean | { left: string; match: string }[] | null;
  correctAnswer: string;
  correctCount: number;
  possibleCount: number;
}

interface QuizSubmissionResult {
  title: string;
  quizId: string;
  results: QuizResultItem[];
  totalCorrect: number;
  totalPossible: number;
}

const isMatchingQuestion = (
  q: QuizQuestion,
): q is QuizQuestion & { options: { left: string; right: string }[] } =>
  q.quizType === "MATCHING" &&
  Array.isArray(q.options) &&
  q.options.every(
    (o) => typeof o === "object" && o !== null && "left" in o && "right" in o,
  );

interface QuizClientProps {
  quizSlug: string;
}

const QuizClient = ({ quizSlug }: QuizClientProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizSubmissionResult | null>(null);
  const debouncedAnswers = useDebounce(answers, 500);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [hydrated, setHydrated] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem(`quiz-${quizSlug}-results`);
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      setSubmitted(true);
      setHydrated(true);
      return;
    }

    const savedAnswers = localStorage.getItem(`quiz-${quizSlug}-answers`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    const fetchQuiz = async () => {
      startLoading();
      try {
        const {
          quiz: fetchedQuiz,
          rateLimited,
          remaining,
        } = await getQuiz(quizSlug);

        if (!fetchedQuiz) {
          if (rateLimited && remaining) {
            const timeRemaining = formatTime(remaining);
            toast.error(
              `Hang tight! Another quiz will arrive in ${timeRemaining}.`,
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
              },
            );
            setCooldownUntil(Date.now() + remaining * 1000);
            setQuiz(null);
            setHydrated(true);
            return;
          }
          setQuiz(null);
          return;
        }

        setQuiz(fetchedQuiz);
        setAnswers((prev) => (Object.keys(prev).length ? prev : {}));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quiz. Please try again.", {
          style: {
            background: "#FFF9F5",
            color: "#6B4C3B",
            borderRadius: "12px",
            padding: "14px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            fontSize: "15px",
            border: "1px solid #FFD1B8",
          },
        });
      } finally {
        stopLoading();
        setHydrated(true);
      }
    };

    fetchQuiz();
  }, [quizSlug, startLoading, stopLoading]);

  // Save answers to localStorage
  useEffect(() => {
    if (!quiz) return;
    localStorage.setItem(
      `quiz-${quizSlug}-answers`,
      JSON.stringify(debouncedAnswers),
    );
  }, [debouncedAnswers, quizSlug, quiz]);

  // Set answer to state for saving
  const handleAnswerChange = (q: QuizQuestion, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleStartNewQuiz = async () => {
    startLoading();
    try {
      const { quiz: newQuiz, rateLimited, remaining } = await getQuiz(quizSlug);

      if (rateLimited) {
        const timeRemaining = formatTime(remaining);
        toast.error(
          `Hang on tight! Another quiz will be ready in ${timeRemaining}.`,
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
          },
        );
        return;
      }

      setQuiz(newQuiz);
      setAnswers({});
      setSubmitted(false);
      localStorage.removeItem(`quiz-${quizSlug}-results`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start a new quiz. Please try again.", {
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
      });
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    startLoading();

    try {
      const {
        results: submittedResults,
        error,
        remaining,
      } = await postQuizResult(
        quizSlug,
        answers,
        quiz.quizQuestion.map((q) => q.id),
      );

      if (error === "rateLimited") {
        const timeRemaining = formatTime(remaining);
        toast.error(
          `Oops! You’re submitting a bit too fast — try again in ${timeRemaining}`,
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
          },
        );
        return;
      }

      if (error) {
        toast.error("Failed to submit quiz. Try again.", {
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
        });
        return;
      }

      setResults(submittedResults);
      setSubmitted(true);

      localStorage.setItem(
        `quiz-${quizSlug}-results`,
        JSON.stringify(submittedResults),
      );
      localStorage.removeItem(`quiz-${quizSlug}-answers`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit quiz. Try again.");
    } finally {
      stopLoading();
    }
  };

  if (cooldownUntil && !quiz) {
    const remainingSeconds = Math.max(
      0,
      Math.floor((cooldownUntil - Date.now()) / 1000),
    );

    return (
      <QuizCooldown
        remainingSeconds={remainingSeconds}
        onStartNewQuiz={handleStartNewQuiz}
      />
    );
  }

  if (!hydrated || isLoading) return <Loader />;

  if (submitted && results) {
    return (
      <div className="space-y-4">
        <QuizResults
          title={results.title}
          results={results.results}
          totalCorrect={results.totalCorrect}
          totalPossible={results.totalPossible}
          onStartNewQuiz={handleStartNewQuiz}
        />
      </div>
    );
  }

  if (!quiz || !quiz.quizQuestion) return <Loader />;

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
                  const isSelected =
                    answers[q.id] === `${opt.option}. ${opt.value}`;
                  return (
                    <Button
                      key={i}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-start rounded-full hover:cursor-pointer ${
                        isSelected
                          ? "bg-[#FFE4D6] text-[#5A3F2C]"
                          : "border-[#FFD1B8] text-[#6B4C3B]"
                      }`}
                      onClick={() =>
                        handleAnswerChange(q, `${opt.option}. ${opt.value}`)
                      }
                      disabled={submitted}
                    >
                      {opt.option}. {opt.value}
                    </Button>
                  );
                },
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
                      className={`flex-1 rounded-full hover:cursor-pointer ${
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
          className="bg-[#FFB899] hover:bg-[#FF9E80] text-white rounded-full float-end hover:cursor-pointer"
        >
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizClient;
