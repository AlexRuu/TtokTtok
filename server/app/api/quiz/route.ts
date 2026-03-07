import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { quizSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

    const { quizQuestion, lessonId } = parsed.data;

    // Step 1: Create the quiz and its questions
    return await withRls(session, async (tx) => {
      const existingLesson = await tx.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!existingLesson) {
        return new NextResponse("Lesson does not exist", { status: 404 });
      }

      const createdQuiz = await tx.quiz.create({
        data: {
          title: `${existingLesson.title} Quiz`,
          slug: `${existingLesson.slug}-quiz`,
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

      const quizTag = await tx.tag.findUnique({
        where: { name: "Quiz" },
      });

      if (!quizTag) {
        return new NextResponse("Could not find Quiz tag", { status: 409 });
      }

      await tx.tagging.create({
        data: {
          tagId: quizTag.id,
          quizId: createdQuiz.id,
        },
      });

      return new NextResponse("Quiz created successfully", { status: 201 });
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
