import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { gradeQuiz } from "@/lib/grade-quiz";
import { rateLimit } from "@/lib/rateLimit";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  try {
    const ip = getClientIp(req);
    const allowed = await rateLimit(ip, 1, 1800);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }

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
      const res = NextResponse.json(randomizedQuiz);
      res.cookies.set(`quiz-${params.slug}-in-progress`, "true", { path: "/" });
      return res;
    });
  } catch (error) {
    console.error("Error finding specific quiz by slug", error);
    return new NextResponse("Error finding specific quiz by slug", {
      status: 500,
    });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug } = params;

  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // Submitted answers (may be fewer than shown questions)
    const submittedAnswers: SubmittedAnswer[] = Object.entries(
      body.answers ?? {}
    ).map(([questionId, answer]) => ({
      questionId,
      answer: answer as string | boolean | MatchingAnswer[],
    }));

    const allQuestionIds: string[] = body.questionIds ?? [];

    // Fetch all questions shown to the user
    const quiz = await withRls(
      session,
      (
        tx
      ): Promise<{
        id: string;
        slug: string;
        title: string;
        quizQuestion: QuizQuestionType[];
      }> =>
        tx.quiz.findUnique({
          where: { slug },
          select: {
            id: true,
            slug: true,
            title: true,
            quizQuestion: {
              where: { id: { in: allQuestionIds } },
              select: {
                id: true,
                question: true,
                quizType: true,
                answer: true,
                options: true,
              },
            },
          },
        })
    );

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    const orderedQuestions = allQuestionIds
      .map((id) => quiz.quizQuestion.find((q) => q.id === id))
      .filter(Boolean) as QuizQuestionType[];

    // Grade all questions
    const { results, totalCorrect, totalPossible } = gradeQuiz(
      orderedQuestions,
      submittedAnswers
    );

    // Save attempt if user is logged in
    if (session?.user?.id) {
      await withRls(session, (tx) =>
        tx.userQuizAttempt.create({
          data: {
            userId: session.user.id,
            quizId: quiz.id,
            score: totalCorrect,
            passed: totalCorrect / totalPossible >= 0.5,
          },
        })
      );
    }

    return NextResponse.json({
      quizId: quiz.id,
      title: quiz.title,
      results,
      totalCorrect,
      totalPossible,
    });
  } catch (error) {
    console.error("Error grading quiz:", error);
    return new NextResponse("Error grading quiz", { status: 500 });
  }
}
