// Shared JSON value type for fields using Prisma's `Json` type
export type JSONValue =
  | string
  | number
  | boolean
  | { [key: string]: JSONValue }
  | JSONValue[]
  | null;

// Quiz type as a union instead of enum
export type QuizType =
  | "MULTIPLE_CHOICE"
  | "FILL_IN_THE_BLANK"
  | "TRUE_FALSE"
  | "MATCHING";

// Vocabulary
export interface Vocabulary {
  id: string;
  english: string;
  korean: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
  vocabularyListId: string;
  vocabularyList: VocabularyList;
}

export interface VocabularyList {
  id: string;
  createdAt: string;
  updatedAt: string;
  lessonId: string;
  tagging: Tagging[];
  vocabulary: Vocabulary[];
  lesson: Lesson;
}

// Quizzes
export interface Quiz {
  id: string;
  lessonId: string;
  createdAt: string;
  lesson: Lesson;
  quizQuestion: QuizQuestion[];
  tagging: Tagging[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  quizId: string;
  quizType: QuizType;
  options: JSONValue;
  answer: string;
  quiz: Quiz;
}

// Lessons
export interface LessonVersion {
  id: string;
  lessonId: string;
  version: number;
  content: JSONValue;
  createdAt: string;
  lesson: Lesson;
}

export interface Lesson {
  id: string;
  title: string;
  lessonNumber: number;
  unitId: string;
  createdAt: string;
  updatedAt: string;
  content: JSONValue;
  slug: string;
  unit: Unit;
  lessonVersion: LessonVersion[];
  quiz: Quiz[];
  tagging: Tagging[];
  vocabularyList?: VocabularyList;
}

// Units
export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  lesson: Lesson[];
}

// Tagging System
export interface Tag {
  id: string;
  name: string;
  backgroundColour: string;
  textColour: string;
  borderColour: string;
  tagging: Tagging[];
}

export interface Tagging {
  id: string;
  tagId: string;
  lessonId: string;
  quizId: string;
  vocabularyListId: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
  lesson: Lesson;
  quiz: Quiz;
  vocabularyList: VocabularyList;
}

export type TextBlock = {
  type: "text";
  content: string;
};

export type ImageBlock = {
  type: "image";
  url: string;
  alt?: string;
};

export type NoteBlock = {
  type: "note";
  content: string;
  style?: "default" | "highlight" | "warning" | "tip";
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
  note?: boolean;
};

export type LessonBlock = TextBlock | ImageBlock | NoteBlock | TableBlock;

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "lesson" | "unit" | "quiz" | "vocabulary" | "tag";
  score: number;
};

export type ScrollableResultsProps = {
  children: React.ReactNode;
  className?: string;
};
