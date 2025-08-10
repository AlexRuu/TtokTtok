import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);

    const allowed = await rateLimit(ip, 15, 60);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const tagsParam = url.searchParams.get("tags");
    if (!tagsParam) {
      return NextResponse.json({ lessons: [], quizzes: [], vocabulary: [] });
    }

    const selectedTagSlugs = tagsParam
      .split(",")
      .filter(Boolean)
      .map((slug) => decodeURIComponent(slug));

    const selectedTagNames = selectedTagSlugs.map((slug) =>
      slug.replace(/-/g, " ")
    );

    const buildTagFilters = (tagNames: string[]) =>
      tagNames.map((tagName) => ({
        tagging: {
          some: {
            tag: {
              is: {
                name: {
                  equals: tagName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          },
        },
      }));

    // Fetch lessons with Unit included
    return await withRls(session, async (tx) => {
      const lessons = await tx.lesson.findMany({
        where: {
          AND: buildTagFilters(selectedTagNames),
        },
        include: {
          unit: true,
        },
      });

      // Fetch quizzes with Lesson and Unit included
      const quizzes = await tx.quiz.findMany({
        where: {
          AND: buildTagFilters(selectedTagNames),
        },
        select: {
          id: true,
          title: true,
          lesson: {
            select: {
              lessonNumber: true,
              unit: {
                select: {
                  unitNumber: true,
                },
              },
            },
          },
        },
      });

      // Fetch vocabulary lists with Lesson and Unit included
      const vocabulary = await tx.vocabularyList.findMany({
        where: {
          AND: buildTagFilters(selectedTagNames),
        },
        select: {
          id: true,
          title: true,
          lesson: {
            select: {
              lessonNumber: true,
              unit: {
                select: {
                  unitNumber: true,
                },
              },
            },
          },
        },
      });

      // Helper to build subtitle string
      const getSubtitle = (unitNumber?: number, lessonNumber?: number) =>
        unitNumber && lessonNumber
          ? `Unit ${unitNumber} - Lesson ${lessonNumber}`
          : "";

      // Format results uniformly with proper subtitles
      const formatItems = (items: any[], type: string) =>
        items.map((item) => {
          let subtitle = "";

          if (type === "lesson") {
            subtitle = getSubtitle(item.unit?.unitNumber, item.lessonNumber);
          } else if (type === "quiz") {
            subtitle = getSubtitle(
              item.lesson?.unit?.unitNumber,
              item.lesson?.lessonNumber
            );
          } else if (type === "vocabulary") {
            subtitle = getSubtitle(
              item.lesson?.unit?.unitNumber,
              item.lesson?.lessonNumber
            );
          }

          return {
            id: item.id,
            title: item.title,
            subtitle,
            href:
              type === "lesson"
                ? `/lessons/${item.slug}`
                : type === "quiz"
                  ? `/quizzes/${item.id}`
                  : `/vocabulary/${item.id}`,
            type,
            score: 1,
          };
        });

      return NextResponse.json({
        lessons: formatItems(lessons, "lesson"),
        quizzes: formatItems(quizzes, "quiz"),
        vocabulary: formatItems(vocabulary, "vocabulary"),
      });
    });
  } catch (error) {
    console.error("Error fetching tagged content", error);
    return NextResponse.json(
      { lessons: [], quizzes: [], vocabulary: [] },
      { status: 500 }
    );
  }
}
