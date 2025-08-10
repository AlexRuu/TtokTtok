import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { LessonFormSchema } from "@/schemas/units-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\p{Script=Hangul}a-z0-9\s-]/gu, "")
    .replace(/\s+/g, "-");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
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

    return await withRls(session, async (tx) => {
      const existingUnit = await tx.unit.findFirst({
        where: { id: unitId },
      });

      if (!existingUnit) {
        return new NextResponse("Unit does not exist", { status: 409 });
      }

      const existingLesson = await tx.lesson.findFirst({
        where: { lessonNumber, title, unitId },
      });

      if (existingLesson) {
        return new NextResponse("Lesson already exists in this unit", {
          status: 409,
        });
      }

      const lesson = await tx.lesson.create({
        data: {
          lessonNumber,
          title,
          content: blocks,
          unit: { connect: { id: unitId } },
          slug: generateSlug(title),
        },
      });

      await tx.lessonVersion.create({
        data: {
          lessonId: lesson.id,
          version: 1,
          content: blocks,
        },
      });

      if (tags.length > 0) {
        await tx.tagging.createMany({
          data: tags.map((tagId: string) => ({
            tagId,
            lessonId: lesson.id,
          })),
        });
      }

      return new NextResponse("Successfully added lesson", { status: 201 });
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return new NextResponse("There was an error posting lesson", {
      status: 500,
    });
  }
}
