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
  submittedAnswers: SubmittedAnswer[],
): QuizSubmissionResult => {
  let totalCorrect = 0;
  let totalPossible = 0;

  const results: QuizResultItem[] = questions.map((q) => {
    const submitted = submittedAnswers.find((a) => a.questionId === q.id);

    let submittedAnswerNormalized: string | boolean | MatchingAnswer[] | null =
      null;
    let correctCount = 0;
    let possibleCount = 1;

    // We'll store the formatted correct answer here
    let correctAnswerFormatted: string = q.answer;

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

          possibleCount = 1;
          const pairValue = 1 / correct.length;
          correctCount =
            correct.filter((pair) =>
              given.some((g) => g.left === pair.left && g.match === pair.match),
            ).length * pairValue;

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

        default: {
          // MULTIPLE_CHOICE

          // Grade the question
          correctCount =
            submitted.answer.toString().charAt(0) === q.answer ? 1 : 0;

          // Format the correct answer as "A: value"
          let options: { option: string; value: string }[] = [];
          if (typeof q.options === "string") {
            try {
              options = JSON.parse(q.options);
            } catch {
              options = [];
            }
          } else if (Array.isArray(q.options)) {
            options = q.options;
          }

          const correctOption = options.find((o) => o.option === q.answer);
          correctAnswerFormatted = correctOption
            ? `${correctOption.option}: ${correctOption.value}`
            : q.answer;

          // Format the submitted answer the same way
          if (typeof submitted.answer === "string") {
            const submittedOption = options.find(
              (o) => o.option === submitted.answer,
            );
            submittedAnswerNormalized = submittedOption
              ? `${submittedOption.option}: ${submittedOption.value}`
              : submitted.answer;
          } else {
            submittedAnswerNormalized = submitted.answer ?? null;
          }

          possibleCount = 1;
          break;
        }
      }
    }

    totalCorrect += correctCount;
    totalPossible += possibleCount;

    return {
      questionId: q.id,
      question: q.question,
      quizType: q.quizType,
      givenAnswer: submittedAnswerNormalized ?? submitted?.answer ?? null,
      correctAnswer: correctAnswerFormatted,
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
