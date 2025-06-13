import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { LessonFormSchema } from "@/schemas/units-schemas";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ lessonId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const lessonId = params.lessonId;
    const parsed = LessonFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid lesson data", { status: 400 });
    }

    const { lessonNumber, title, unitId, tags, blocks } = parsed.data;

    if (
      !lessonNumber ||
      !title ||
      !unitId ||
      !Array.isArray(tags) ||
      tags.length === 0 ||
      !Array.isArray(blocks) ||
      blocks.length === 0
    ) {
      return new NextResponse("Missing one or more fields", { status: 400 });
    }

    const existingLesson = await prismadb.lesson.findFirst({
      where: { id: lessonId },
      include: {
        lessonVersion: {
          where: { lessonId: lessonId },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!existingLesson) {
      return new NextResponse("Lesson does not exist", { status: 409 });
    }

    const nextLesson = existingLesson.lessonVersion[0].version + 1;

    await prismadb.$transaction(async (tx) => {
      const lesson = await tx.lesson.update({
        where: { id: lessonId },
        data: {
          lessonNumber,
          title,
          content: blocks,
          unit: { connect: { id: unitId } },
        },
      });

      await tx.lessonVersion.create({
        data: {
          lessonId: lesson.id,
          version: nextLesson,
          content: blocks,
        },
      });

      await tx.tagging.deleteMany({ where: { lessonId } });

      if (tags.length > 0) {
        await tx.tagging.createMany({
          data: tags.map((tagId: string) => ({
            tagId,
            lessonId: lesson.id,
          })),
        });
      }
    });

    return new NextResponse("Successfully updated lesson", { status: 200 });
  } catch (error) {
    console.log("Error updating lesson", error);
    return new NextResponse("Error patching lesson", { status: 500 });
  }
}
