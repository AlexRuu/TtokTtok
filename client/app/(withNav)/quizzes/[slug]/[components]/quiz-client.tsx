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

// Quiz type helpers
const isMC = (q: QuizQuestion) => q.quizType === "MULTIPLE_CHOICE";
const isTF = (q: QuizQuestion) => q.quizType === "TRUE_FALSE";
const isFIB = (q: QuizQuestion) => q.quizType === "FILL_IN_THE_BLANK";

type AnswerValue = string | Record<string, string> | boolean;

interface CurrentAttempt {
  quiz: Quiz;
  answers: Record<string, AnswerValue>;
}
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
  quizId: string;
  results: QuizResultItem[];
  totalCorrect: number;
  totalPossible: number;
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
}

const QuizClient = ({ quizId }: QuizClientProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizSubmissionResult | null>(null);
  const debouncedAnswers = useDebounce(answers, 500);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem(`quiz-${quizId}-results`);
    if (savedResults) {
      setResults(JSON.parse(savedResults));
      setSubmitted(true);
      setHydrated(true);
      return;
    }

    const savedAttempt = localStorage.getItem(`quiz-${quizId}-attempt`);
    if (savedAttempt) {
      const parsed: CurrentAttempt = JSON.parse(savedAttempt);
      setQuiz(parsed.quiz);
      setAnswers(parsed.answers || {});
      setHydrated(true); // hydrated immediately
      return;
    }

    // Only fetch from server if no saved results or attempt
    const fetchQuiz = async () => {
      startLoading();
      try {
        const { quiz: fetchedQuiz, rateLimited } = await getQuiz(quizId);
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
          return;
        }

        if (fetchedQuiz) {
          setQuiz(fetchedQuiz);
          setAnswers({});
          localStorage.setItem(
            `quiz-${quizId}-attempt`,
            JSON.stringify({ quiz: fetchedQuiz, answers: {} })
          );
        }
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
          className:
            "transition-all transform duration-300 ease-in-out font-medium",
        });
      } finally {
        stopLoading();
        setHydrated(true); // hydrated after fetch
      }
    };

    fetchQuiz();
  }, [quizId, startLoading, stopLoading]);

  // Save answers to localStorage
  useEffect(() => {
    if (!quiz) return;
    localStorage.setItem(
      `quiz-${quizId}-attempt`,
      JSON.stringify({ quiz, answers: debouncedAnswers })
    );
  }, [debouncedAnswers, quiz, quizId]);

  const handleAnswerChange = (q: QuizQuestion, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleStartNewQuiz = async () => {
    startLoading();

    try {
      const { quiz: newQuiz, rateLimited } = await getQuiz(quizId);

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
        return;
      }

      if (newQuiz) {
        setQuiz(newQuiz);
        setAnswers({});
        setSubmitted(false);
        localStorage.setItem(
          `quiz-${quizId}-attempt`,
          JSON.stringify({ quiz: newQuiz, answers: {} })
        );
      }
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
    startLoading();
    try {
      if (!quiz) return;

      const { results: submittedResults, error } = await postQuizResult(
        quizId,
        answers,
        quiz.quizQuestion.map((q) => q.id)
      );

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
        `quiz-${quizId}-results`,
        JSON.stringify(submittedResults)
      );
      localStorage.removeItem(`quiz-${quizId}-attempt`);
    } catch (err) {
      console.error(err);
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
    } finally {
      stopLoading();
    }
  };

  if (!hydrated || isLoading) return <Loader />;

  if (submitted && results) {
    return (
      <QuizResults
        title={quiz?.title || "Quiz Results"}
        results={results.results}
        totalCorrect={results.totalCorrect}
        totalPossible={results.totalPossible}
      />
    );
  }

  if (!quiz) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="hover:cursor-pointer border-[#FFD1B8] text-[#6B4C3B] hover:bg-[#FFE4D6] rounded-full px-6"
          onClick={handleStartNewQuiz}
          disabled={isLoading}
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
