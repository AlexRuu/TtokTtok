import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { quizSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ quizId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const quizId = params.quizId;
    const parsed = quizSchema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse("Invalid quiz data", { status: 422 });
    }

    const { lessonId, quizQuestion } = parsed.data;

    if (!lessonId || !Array.isArray(quizQuestion) || quizQuestion.length <= 0) {
      return new NextResponse("Missing one or more fields", { status: 400 });
    }

    const existingLesson = await prismadb.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return new NextResponse("Lesson does not exist", { status: 404 });
    }

    const existingQuiz = await prismadb.quiz.findUnique({
      where: { id: quizId },
    });

    if (!existingQuiz) {
      return new NextResponse("Quiz does not exist", { status: 404 });
    }

    if (quizQuestion.length === 0) {
      return new NextResponse("Quiz must contain at least one question", {
        status: 400,
      });
    }

    await prismadb.$transaction(async (tx) => {
      await tx.quizQuestion.deleteMany({
        where: { quizId: quizId },
      });

      await tx.quizQuestion.createMany({
        data: quizQuestion.map((q) => {
          let options: any = undefined;

          if (q.quizType === "MULTIPLE_CHOICE" || q.quizType === "MATCHING") {
            options = q.options;
          }

          return {
            quizId: quizId,
            question: q.question,
            quizType: q.quizType,
            options: options,
            answer:
              typeof q.answer === "string"
                ? q.answer
                : JSON.stringify(q.answer),
          };
        }),
      });
    });

    return new NextResponse("Quiz has been updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("There was an error updating quiz", error);
    return new NextResponse("There was an error trying to update the quiz", {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ quizId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const quizId = params.quizId;

    const existingQuiz = await prismadb.quiz.findUnique({
      where: { id: quizId },
    });

    if (!existingQuiz) {
      return new NextResponse("Quiz list does not exist", { status: 404 });
    }

    await prismadb.quiz.delete({
      where: { id: quizId },
    });

    return new NextResponse("Quiz was successfully deleted", { status: 200 });
  } catch (error) {
    console.log("There was an error deleting quiz", error);
    return new NextResponse("There was an error deleting quiz", {
      status: 500,
    });
  }
}
