import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizResultItem } from "@/types";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface QuizResultsProps {
  title: string;
  results: QuizResultItem[];
  totalCorrect: number;
  totalPossible: number;
  onStartNewQuiz?: () => void;
}

const formatAnswer = (
  answer: string | boolean | { left: string; match: string }[] | null,
) => {
  if (answer === null) return "No answer";
  if (typeof answer === "boolean") return answer ? "True" : "False";
  if (typeof answer === "string") return answer;
  if (Array.isArray(answer)) {
    return answer.map((pair) => `${pair.left} → ${pair.match}`).join(", ");
  }
  return String(answer);
};

const getEncouragement = (percentage: number) => {
  if (percentage === 100) return "Perfect! 완벽해요!";
  if (percentage >= 90) return "Outstanding! 뛰어나요!";
  if (percentage >= 80) return "Great work! 잘했어요!";
  if (percentage >= 70) return "Good job! 잘 하고 있어요!";
  if (percentage >= 60) return "Not bad! 괜찮아요, 조금만 더!";
  if (percentage >= 50) return "Keep going! 계속 도전해봐요!";
  return "Don't give up! 포기하지 마세요!";
};

export const QuizResults: React.FC<QuizResultsProps> = ({
  title,
  results,
  totalCorrect,
  totalPossible,
  onStartNewQuiz,
}) => {
  const percentage = ((totalCorrect / totalPossible) * 100).toFixed(0);
  const percentageNum = Number(percentage);
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const redirectPath = `/signin?redirect=${encodeURIComponent(pathName)}`;

  const passed = percentageNum >= 70;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md md:pb-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {title} - Results
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="bg-[#FFE5D4] text-[#6B4C3B] px-4 py-2 rounded-full font-semibold shadow-sm text-sm sm:text-base">
            Score: {totalCorrect} / {totalPossible}
          </div>
          <div
            className={`px-4 py-2 rounded-full font-semibold shadow-sm text-sm sm:text-base border transition-colors ${
              passed
                ? "bg-[#E5F7EA] text-[#2F7A42] border-[#C1EAC5]"
                : "bg-[#FFE8E8] text-[#C94545] border-[#F5BABA]"
            }`}
          >
            {percentage}%
          </div>
        </div>

        <p className="mt-1 text-sm sm:text-lg text-[#6B4C3B]/80 italic">
          {getEncouragement(percentageNum)}
        </p>
      </div>

      <div className="h-px bg-[#FFD8C2]/70 w-2/3 mx-auto my-2" />

      {/* Results List */}
      <div className="space-y-4">
        {results.map((r, i) => {
          const isMatching = r.quizType === "MATCHING";
          const fullyCorrect = r.correctCount === r.possibleCount;
          const partiallyCorrect =
            isMatching &&
            r.correctCount > 0 &&
            r.correctCount < r.possibleCount;

          return (
            <Card
              key={r.questionId}
              className={`shadow-sm border rounded-2xl bg-white transition-all ${
                fullyCorrect
                  ? "border-[#A7E3B1]/50 hover:border-[#7ACD8A]"
                  : partiallyCorrect
                    ? "border-[#D9986F]/50 hover:border-[#C6865E]"
                    : "border-[#F2B3B3]/50 hover:border-[#E57C7C]"
              }`}
            >
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-base sm:text-lg flex-1 min-w-0">
                    {i + 1}. {r.question}
                    <span className="ml-1 text-xs sm:text-sm text-gray-400">
                      ({r.correctCount}/{r.possibleCount})
                    </span>
                  </p>

                  {/* Icon / Partial Score */}
                  {fullyCorrect ? (
                    <CheckCircle2 className="text-[#0F9D58] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  ) : partiallyCorrect ? (
                    <span className="text-[#D9986F] font-semibold text-sm sm:text-base">
                      {r.correctCount}/{r.possibleCount}
                    </span>
                  ) : (
                    <XCircle className="text-[#E53935] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  )}
                </div>

                <p
                  className={`text-sm sm:text-base ${
                    fullyCorrect
                      ? "text-[#3A7D44]"
                      : partiallyCorrect
                        ? "text-[#D9986F]"
                        : "text-[#B94A4A]"
                  }`}
                >
                  <span className="font-semibold">Your Answer:</span>{" "}
                  {formatAnswer(r.givenAnswer)}
                </p>

                <p
                  className={`text-sm sm:text-base ${
                    fullyCorrect ? "text-gray-400 italic" : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">Correct Answer:</span>{" "}
                  {formatAnswer(r.correctAnswer)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Signup suggestion */}
      {!session?.user && percentageNum >= 60 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center bg-[#FFF3EB] border border-[#FFD8C2] rounded-xl px-4 py-3 max-w-md mx-auto shadow-sm"
        >
          <p className="text-sm sm:text-base text-[#6B4C3B]/80">
            Save your progress for next time?{" "}
            <button
              onClick={() => router.push(redirectPath)}
              className="text-[#FF9E80] font-semibold underline hover:text-[#FF7C50] ml-1 transition-colors hover:cursor-pointer"
            >
              Sign In / Sign Up
            </button>
          </p>
        </motion.div>
      )}

      {/* Start New Quiz Button */}
      {onStartNewQuiz && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center pt-6 border-t border-[#FFD8C2]/50 mt-6"
        >
          <Button
            onClick={onStartNewQuiz}
            className="bg-[#FFB899] hover:bg-[#FF9E80] text-white rounded-full transition-all shadow-sm hover:cursor-pointer w-full sm:w-auto"
          >
            Start New Quiz
          </Button>
        </motion.div>
      )}
    </div>
  );
};
