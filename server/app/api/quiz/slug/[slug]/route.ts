import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    return await withRls(session, async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: {
          slug: params.slug,
        },
        include: {
          quizQuestion: true,
          lesson: { include: { unit: true } },
          tagging: { include: { tag: true } },
        },
      });

      if (!quiz) {
        return new NextResponse("Quiz not found", { status: 404 });
      }

      // Get random 10 questions from list of questions
      const shuffledQuizQuestions = [...quiz.quizQuestion].sort(
        () => 0.5 - Math.random()
      );
      const randomQuestions = shuffledQuizQuestions.slice(
        0,
        Math.min(10, shuffledQuizQuestions.length)
      );
      const randomizedQuiz = {
        ...quiz,
        quizQuestion: randomQuestions,
      };

      return NextResponse.json(randomizedQuiz);
    });
  } catch (error) {
    console.error("Error finding specific quiz by slug", error);
    return new NextResponse("Error finding specific quiz by slug", {
      status: 500,
    });
  }
}
