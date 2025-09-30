// components/QuizResults.tsx
import { Card, CardContent } from "@/components/ui/card";
import { QuizResultItem } from "@/types";

interface QuizResultsProps {
  title: string;
  results: QuizResultItem[];
  totalCorrect: number;
  totalPossible: number;
}

const formatAnswer = (
  answer: string | boolean | { left: string; match: string }[] | null
) => {
  if (answer === null) return "No answer";
  if (typeof answer === "boolean") return answer ? "True" : "False";
  if (typeof answer === "string") return answer;
  if (Array.isArray(answer)) {
    return answer.map((pair) => `${pair.left} → ${pair.match}`).join(", ");
  }
  return String(answer);
};

export const QuizResults: React.FC<QuizResultsProps> = ({
  title,
  results,
  totalCorrect,
  totalPossible,
}) => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold">{title} - Results</h1>
      <p className="text-lg font-semibold">
        Score: {totalCorrect} / {totalPossible} (
        {((totalCorrect / totalPossible) * 100).toFixed(0)}%)
      </p>

      {results.map((r, i) => (
        <Card
          key={r.questionId}
          className={`shadow-sm border ${
            r.correctCount === r.possibleCount
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="p-4 space-y-2">
            <p className="font-medium">
              {i + 1}. {r.question} ({r.correctCount}/{r.possibleCount})
            </p>
            <p
              className={`${
                r.correctCount === r.possibleCount
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="font-semibold">Your Answer:</span>{" "}
              {formatAnswer(r.givenAnswer)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Correct Answer:</span>{" "}
              {formatAnswer(r.correctAnswer)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
