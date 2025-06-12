import prismadb from "@/lib/prismadb";

// Lessons and Units
const findLessonUnique = async (lessonId: string) => {
  return await prismadb.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: true,
      tagging: { include: { tag: true } },
      quiz: { include: { quizQuestion: true } },
      vocabularyList: { include: { vocabulary: true } },
      lessonVersion: true,
      userLessonProgress: true,
      userChapterReview: true,
    },
  });
};

const findAscUnits = async () => {
  return await prismadb.unit.findMany({
    orderBy: { unitNumber: "asc" },
    include: {
      lesson: {
        include: {
          tagging: { include: { tag: true } },
          quiz: { include: { quizQuestion: true } },
          vocabularyList: { include: { vocabulary: true } },
          lessonVersion: true,
          userLessonProgress: true,
          userChapterReview: true,
        },
      },
    },
  });
};

const findTags = async () => {
  return await prismadb.tag.findMany({});
};

const findLessons = async () => {
  return prismadb.lesson.findMany({
    include: { unit: true, vocabularyList: { include: { vocabulary: true } } },
    orderBy: [
      {
        unit: {
          unitNumber: "asc",
        },
      },
      {
        lessonNumber: "asc",
      },
    ],
  });
};

const findUniqueUnit = async (unitId: string) => {
  return await prismadb.unit.findFirst({
    where: { id: unitId },
  });
};

// Tags
const findUniqueTag = async (tagId: string) => {
  return await prismadb.tag.findUnique({
    where: {
      id: tagId,
    },
  });
};

// Vocabulary
const findUniqueVocabulary = async (vocabularyListId: string) => {
  return await prismadb.vocabularyList.findUnique({
    where: { id: vocabularyListId },
    include: { vocabulary: true },
  });
};

// Quiz
const findQuizzes = async () => {
  return await prismadb.quiz.findMany({
    include: { lesson: true, quizQuestion: true },
    orderBy: {
      lesson: {
        lessonNumber: "asc",
      },
    },
  });
};

const findUniqueQuiz = async (quizId: string) => {
  return await prismadb.quiz.findUnique({
    where: { id: quizId },
    include: { quizQuestion: true },
  });
};

// User
const findUniqueUser = async (userId: string) => {
  return await prismadb.user.findUnique({
    where: { id: userId },
  });
};

const findUsers = async () => {
  return await prismadb.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Admin Dashboard
const stats = async () => {
  return await prismadb.userLessonProgress.groupBy({
    by: ["lessonId"],
    _count: {
      _all: true,
    },
  });
};

const completedCounts = async () => {
  return await prismadb.userLessonProgress.groupBy({
    by: ["lessonId"],
    where: {
      completedAt: {
        not: null,
      },
    },
    _count: {
      _all: true,
    },
  });
};

export {
  findLessonUnique,
  findAscUnits,
  findTags,
  findUniqueTag,
  findUniqueUser,
  findUsers,
  stats,
  completedCounts,
  findLessons,
  findUniqueVocabulary,
  findUniqueUnit,
  findQuizzes,
  findUniqueQuiz,
};
