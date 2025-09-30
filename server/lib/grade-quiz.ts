export interface QuizResultItem {
  questionId: string;
  question: string;
  quizType: QuizQuestionType["quizType"];
  givenAnswer: string | boolean | MatchingAnswer[] | null;
  correctAnswer: string;
  correctCount: number;
  possibleCount: number;
}

export interface QuizSubmissionResult {
  results: QuizResultItem[];
  totalCorrect: number;
  totalPossible: number;
}

export const gradeQuiz = (
  questions: QuizQuestionType[],
  submittedAnswers: SubmittedAnswer[]
): QuizSubmissionResult => {
  let totalCorrect = 0;
  let totalPossible = 0;

  const results = questions.map((q) => {
    const submitted = submittedAnswers.find((a) => a.questionId === q.id);

    let submittedAnswerNormalized: string | boolean | MatchingAnswer[] | null =
      null;
    let correctCount = 0;
    let possibleCount = 1;

    if (submitted) {
      switch (q.quizType) {
        case "MATCHING": {
          const correct = JSON.parse(q.answer) as MatchingAnswer[];
          let given: MatchingAnswer[] = [];

          if (Array.isArray(submitted.answer)) {
            given = submitted.answer;
          } else if (typeof submitted.answer === "object" && submitted.answer) {
            given = Object.entries(submitted.answer).map(([left, match]) => ({
              left,
              match: match as string,
            }));
          }

          possibleCount = correct.length;
          correctCount = correct.filter((pair) =>
            given.some((g) => g.left === pair.left && g.match === pair.match)
          ).length;

          submittedAnswerNormalized = given;
          break;
        }

        case "FILL_IN_THE_BLANK": {
          const submittedStr =
            typeof submitted.answer === "string"
              ? submitted.answer.trim().toLowerCase()
              : "";
          const correctStr = q.answer.trim().toLowerCase();
          correctCount = submittedStr === correctStr ? 1 : 0;
          break;
        }

        case "TRUE_FALSE": {
          const submittedBool =
            String(submitted.answer).toLowerCase() === "true";
          const correctAnswerBool = String(q.answer).toLowerCase() === "true";
          correctCount = submittedBool === correctAnswerBool ? 1 : 0;
          break;
        }

        default:
          // MULTIPLE_CHOICE
          correctCount = submitted.answer === q.answer ? 1 : 0;
          break;
      }
    }

    totalCorrect += correctCount;
    totalPossible += possibleCount;

    return {
      questionId: q.id,
      question: q.question,
      quizType: q.quizType,
      givenAnswer: submittedAnswerNormalized ?? submitted?.answer ?? null,
      correctAnswer:
        q.quizType === "MATCHING" ? JSON.parse(q.answer) : q.answer,
      correctCount,
      possibleCount,
    };
  });

  return {
    results,
    totalCorrect,
    totalPossible,
  };
};
