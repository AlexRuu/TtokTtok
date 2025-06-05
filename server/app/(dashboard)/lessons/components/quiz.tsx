import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz, QuizQuestion } from "@/lib/generated/prisma";

interface QuizContentProps {
  quiz: (Quiz & { quizQuestion: QuizQuestion[] })[];
}
interface QuizOption {
  value: string;
  option: string;
}

const QuizContent: React.FC<QuizContentProps> = ({ quiz }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((qz, index) => (
          <div key={qz.id} className="space-y-4 border rounded-md p-4">
            <h3 className="text-md font-medium">Quiz {index + 1}</h3>

            {qz.quizQuestion.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No questions found.
              </p>
            )}

            {qz.quizQuestion.map((question, index) => {
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
                  className="border rounded-md p-3 space-y-2 bg-muted"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">
                      Q{index + 1}: {question.question}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {question.quizType}
                    </Badge>
                  </div>

                  {/* Show options if available */}
                  {parsedOptions.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {parsedOptions.map((opt, i) => {
                        if (
                          typeof opt === "object" &&
                          "option" in opt &&
                          "value" in opt
                        ) {
                          return (
                            <li key={i} className="list-none">
                              <span className="font-medium">{opt.option}.</span>
                              {opt.value}
                            </li>
                          );
                        }

                        // fallback for malformed or simple string options
                        return <li key={i}>{String(opt)}</li>;
                      })}
                    </ul>
                  )}

                  <p className="text-sm text-green-600">
                    <span className="font-medium">Answer:</span>{" "}
                    {question.answer}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuizContent;
