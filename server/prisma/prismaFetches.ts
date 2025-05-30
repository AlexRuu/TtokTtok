import prismadb from "@/lib/prismadb";

// Lessons and Units
const findLessonUnique = async (lessonId: string) => {
  return await prismadb.lesson.findUnique({
    where: { id: lessonId },
    include: { unit: true, tagging: true },
  });
};

const findAscUnits = async () => {
  return await prismadb.unit.findMany({
    orderBy: { unitNumber: "asc" },
  });
};

const findTags = async () => {
  return await prismadb.tag.findMany({});
};

// Tags
const findUniqueTag = async (tagId: string) => {
  return await prismadb.tag.findUnique({
    where: {
      id: tagId,
    },
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

export {
  findLessonUnique,
  findAscUnits,
  findTags,
  findUniqueTag,
  findUniqueUser,
  findUsers,
};
