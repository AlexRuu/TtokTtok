import { authOptions } from "@/lib/auth";
import { Tag } from "@/lib/generated/prisma";
import { withRls } from "@/lib/withRLS";
import { quizSchema } from "@/schemas/form-schemas";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const quizTypeToTagMap: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  FILL_IN_THE_BLANK: "Fill In The Blank",
  TRUE_FALSE: "True or False",
  MATCHING: "Matching",
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = quizSchema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse("Invalid quiz data", { status: 400 });
    }

    const { title, quizQuestion, lessonId } = parsed.data;

    if (
      !lessonId ||
      !Array.isArray(quizQuestion) ||
      quizQuestion.length === 0
    ) {
      return new NextResponse("Missing one or more fields", { status: 400 });
    }

    // Step 1: Create the quiz and its questions
    return await withRls(session, async (tx) => {
      const existingLesson = await tx.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!existingLesson) {
        return new NextResponse("Lesson does not exist", { status: 409 });
      }

      await tx.$transaction(async (trx: Prisma.TransactionClient) => {
        const createdQuiz = await trx.quiz.create({
          data: {
            title,
            lesson: { connect: { id: lessonId } },
            quizQuestion: {
              create: quizQuestion.map((q) => ({
                question: q.question,
                quizType: q.quizType,
                options:
                  q.quizType === "MULTIPLE_CHOICE" || q.quizType === "MATCHING"
                    ? q.options
                    : undefined,
                answer:
                  typeof q.answer === "string"
                    ? q.answer
                    : JSON.stringify(q.answer),
              })),
            },
          },
        });

        const uniqueTagNames = Array.from(
          new Set(
            quizQuestion
              .map((q) => quizTypeToTagMap[q.quizType])
              .filter(Boolean)
          )
        );

        const tags = await trx.tag.findMany({
          where: { name: { in: uniqueTagNames } },
        });

        for (const tag of tags) {
          await trx.tagging.create({
            data: {
              tagId: tag.id,
              quizId: createdQuiz.id,
            },
          });
        }
      });

      return new NextResponse("Quiz created successfully", { status: 200 });
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return new NextResponse("There was an error creating the quiz", {
      status: 500,
    });
  }
}
