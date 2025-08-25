import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { quizSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\p{Script=Hangul}a-z0-9\s-]/gu, "")
    .replace(/\s+/g, "-");

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

      const createdQuiz = await tx.quiz.create({
        data: {
          title,
          slug: generateSlug(title),
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
          quizQuestion.map((q) => quizTypeToTagMap[q.quizType]).filter(Boolean)
        )
      );

      const tags = await tx.tag.findMany({
        where: { name: { in: uniqueTagNames } },
      });

      for (const tag of tags) {
        await tx.tagging.create({
          data: {
            tagId: tag.id,
            quizId: createdQuiz.id,
          },
        });
      }

      return new NextResponse("Quiz created successfully", { status: 200 });
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return new NextResponse("There was an error creating the quiz", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    return await withRls(session, async (tx) => {
      const quizzes = await tx.quiz.findMany({
        include: {
          quizQuestion: true,
          lesson: { include: { unit: true } },
          tagging: { include: { tag: true } },
        },
        orderBy: { lesson: { unit: { unitNumber: "asc" } } },
      });

      return NextResponse.json(quizzes);
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return new NextResponse("There was an error fetching the quizzes", {
      status: 500,
    });
  }
}
