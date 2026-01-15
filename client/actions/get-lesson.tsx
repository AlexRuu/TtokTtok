import { Lesson } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/lessons/slug`;

const getLesson = async (slug: string) => {
  const res = await fetch(`${URL}/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return (await res.json()) as Lesson;
};

export default getLesson;
