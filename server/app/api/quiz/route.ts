import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
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

    const { title, quizQuestion, lessonId } = parsed.data;

    if (!lessonId || !Array.isArray(quizQuestion) || quizQuestion.length <= 0) {
      return new NextResponse("Missing one or more fields", { status: 400 });
    }

    const existingLesson = await prismadb.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return new NextResponse("Lesson does not exist", { status: 409 });
    }

    await prismadb.quiz.create({
      data: {
        title: title,
        lesson: { connect: { id: lessonId } },
        quizQuestion: {
          create: quizQuestion.map((q) => {
            let optionsOrPairs: any = undefined;

            if (q.quizType === "MULTIPLE_CHOICE") {
              optionsOrPairs = q.options;
            } else if (q.quizType === "MATCHING") {
              optionsOrPairs = q.options;
            }

            return {
              question: q.question,
              quizType: q.quizType,
              options: optionsOrPairs ?? undefined,
              answer:
                typeof q.answer === "string"
                  ? q.answer
                  : JSON.stringify(q.answer),
            };
          }),
        },
      },
    });

    return new NextResponse("Quiz created successfully", { status: 200 });
  } catch (error) {
    console.log("There was an error creating the quiz", error);
    return new NextResponse("There was an error creating the quiz", {
      status: 500,
    });
  }
}
