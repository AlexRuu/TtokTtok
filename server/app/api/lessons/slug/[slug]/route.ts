import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  try {
    const lesson = await prismadb.lesson.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        unit: true,
        quiz: { include: { quizQuestion: true } },
        tagging: { include: { tag: true } },
        vocabularyList: { include: { vocabulary: true } },
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error finding specific lesson by slug", error);
    return new NextResponse("Error finding specific lesson by slug", {
      status: 500,
    });
  }
}
