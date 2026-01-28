import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    return await withRls(session, async (tx) => {
      const lesson = await tx.lesson.findUnique({
        where: { slug: params.slug },
        include: {
          unit: {
            include: {
              lesson: {
                orderBy: { lessonNumber: "asc" },
                select: {
                  id: true,
                  slug: true,
                  lessonNumber: true,
                  title: true,
                },
              },
            },
          },
          quiz: { include: { quizQuestion: true } },
          tagging: { include: { tag: true } },
          vocabularyList: { include: { vocabulary: true } },
        },
      });

      if (!lesson) {
        return new NextResponse("Lesson not found", { status: 404 });
      }

      const { lessons, ...unitRest } = lesson.unit;

      return NextResponse.json({
        ...lesson,
        unit: {
          ...unitRest,
          lessonSummaries: lessons,
        },
      });
    });
  } catch (error) {
    console.error("Error finding specific lesson by slug", error);
    return new NextResponse("Error finding specific lesson by slug", {
      status: 500,
    });
  }
}
