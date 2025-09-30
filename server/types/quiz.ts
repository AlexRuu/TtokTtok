type MatchingAnswer = { left: string; match: string };

type SubmittedAnswer = {
  questionId: string;
  answer: string | boolean | MatchingAnswer[];
};

type QuizQuestionType = {
  id: string;
  question: string;
  quizType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK" | "MATCHING";
  answer: string;
  options?: unknown;
};
