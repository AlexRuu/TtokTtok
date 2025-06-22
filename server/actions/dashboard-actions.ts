import prismadb from "@/lib/prismadb";

const getTopStartedLessons = async () => {
  const counted = await prismadb.userLessonProgress.groupBy({
    by: ["lessonId"],
    _count: { lessonId: true },
    orderBy: {
      _count: {
        lessonId: "desc",
      },
    },
    take: 5,
  });

  const lessonIds = counted.map((item) => item.lessonId);

  const lessons = await prismadb.lesson.findMany({
    where: { id: { in: lessonIds } },
    include: {
      unit: {
        select: { unitNumber: true },
      },
    },
  });

  const countMap = new Map(
    counted.map(({ lessonId, _count }) => [lessonId, _count.lessonId])
  );

  return lessons
    .map((lesson) => ({
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      unitNumber: lesson.unit?.unitNumber ?? null,
      count: countMap.get(lesson.id) || 0,
    }))
    .sort((a, b) => b.count - a.count);
};

const getTopCompletedLessons = async () => {
  const counted = await prismadb.userLessonProgress.groupBy({
    by: ["lessonId"],
    where: { NOT: { completedAt: null } },
    _count: { lessonId: true },
    orderBy: {
      _count: {
        lessonId: "desc",
      },
    },
    take: 5,
  });

  const lessonIds = counted.map((item) => item.lessonId);

  const lessons = await prismadb.lesson.findMany({
    where: { id: { in: lessonIds } },
    include: {
      unit: {
        select: { unitNumber: true },
      },
    },
  });

  const countMap = new Map(
    counted.map(({ lessonId, _count }) => [lessonId, _count.lessonId])
  );

  return lessons
    .map((lesson) => ({
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      unitNumber: lesson.unit?.unitNumber ?? null,
      count: countMap.get(lesson.id) || 0,
    }))
    .sort((a, b) => b.count - a.count);
};

const getTopAttemptedQuizzes = async () => {
  const counted = await prismadb.userQuizAttempt.groupBy({
    by: ["quizId"],
    _count: { quizId: true },
    orderBy: {
      _count: {
        quizId: "desc",
      },
    },
    take: 5,
  });

  const quizIds = counted.map((item) => item.quizId);

  const quizzes = await prismadb.quiz.findMany({
    where: { id: { in: quizIds } },
    select: {
      id: true,
      lesson: {
        select: {
          title: true,
          lessonNumber: true,
          unit: {
            select: { unitNumber: true },
          },
        },
      },
    },
  });

  const countMap = new Map(
    counted.map(({ quizId, _count }) => [quizId, _count.quizId])
  );

  return quizzes
    .map((quiz) => ({
      id: quiz.id,
      title: `Unit ${quiz.lesson.unit?.unitNumber ?? "?"} – Lesson ${quiz.lesson.lessonNumber}: ${quiz.lesson.title}`,
      attemptCount: countMap.get(quiz.id) || 0,
    }))
    .sort((a, b) => b.attemptCount - a.attemptCount);
};

const highestAverageQuizzes = async () => {
  const counted = await prismadb.userQuizAttempt.groupBy({
    by: ["quizId"],
    _avg: { score: true },
    orderBy: {
      _avg: {
        score: "desc",
      },
    },
    take: 5,
  });

  const quizIds = counted.map((item) => item.quizId);

  const quizzes = await prismadb.quiz.findMany({
    where: { id: { in: quizIds } },
    select: {
      id: true,
    },
  });

  const avgMap = new Map(
    counted.map(({ quizId, _avg }) => [quizId, _avg.score || 0])
  );

  return quizzes
    .map((quiz) => ({
      id: quiz.id,
      averageScore: avgMap.get(quiz.id) || 0,
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
};

const getIncompletedLessons = async () => {
  const counted = await prismadb.userLessonProgress.groupBy({
    by: ["lessonId"],
    where: { completedAt: null },
    _count: { lessonId: true },
    orderBy: {
      _count: {
        lessonId: "desc",
      },
    },
    take: 5,
  });

  const lessonIds = counted.map((item) => item.lessonId);

  const lessons = await prismadb.lesson.findMany({
    where: { id: { in: lessonIds } },
    select: {
      id: true,
      title: true,
      lessonNumber: true,
    },
  });

  const countMap = new Map(
    counted.map(({ lessonId, _count }) => [lessonId, _count.lessonId])
  );

  return lessons
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      lessonNumber: lesson.lessonNumber,
      incompleteCount: countMap.get(lesson.id) || 0,
    }))
    .sort((a, b) => b.incompleteCount - a.incompleteCount);
};

export {
  getTopStartedLessons,
  getTopCompletedLessons,
  getTopAttemptedQuizzes,
  highestAverageQuizzes,
  getIncompletedLessons,
};
