export type MatchingAnswer = { left: string; match: string };

export type MultipleChoiceOptions = string[];
export type MatchingOptions = { left: string; right: string }[];

export type SubmittedAnswer = {
  questionId: string;
  answer: string | boolean | MatchingAnswer[];
};

export type QuizQuestionType = {
  id: string;
  question: string;
  quizType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK" | "MATCHING";
  answer: string;
  options?: MultipleChoiceOptions | MatchingOptions;
};
