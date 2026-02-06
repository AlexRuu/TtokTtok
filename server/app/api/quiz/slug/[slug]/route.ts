import { authOptions } from "@/lib/auth";
import { Lesson, QuizQuestion, Tagging } from "@/lib/generated/prisma/client";

import { getClientIp } from "@/lib/getIP";
import { gradeQuiz } from "@/lib/grade-quiz";
import { delRedis, getRedisCache, rateLimit, setRedisCache } from "@/lib/redis";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Quiz = {
  id: string;
  lessonId: string;
  title: string;
  slug: string;
  createdAt: string;
  lesson: Lesson;
  quizQuestion: QuizQuestion[];
  tagging: Tagging[];
};

const TIER_LIMITS = {
  guest: { max: 1, window: 1800 },
  user: { max: 5, window: 3600 },
} as const;

const generateRandomQuiz = (quiz: Quiz) => {
  const shuffledQuizQuestions = [...quiz.quizQuestion].sort(
    () => 0.5 - Math.random(),
  );
  const randomQuestions = shuffledQuizQuestions.slice(
    0,
    Math.min(10, shuffledQuizQuestions.length),
  );
  return {
    ...quiz,
    quizQuestion: randomQuestions,
  };
};

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    const ip = getClientIp(req);

    const tier = session?.user ? "user" : "guest";

    const isUser = !!session?.user?.id;
    const key = session?.user?.id
      ? `quiz:get:${session.user.id}`
      : `quiz:get:${ip}`;
    const cacheKey = `quiz_in_progress:${key}:${params.slug}`;

    if (isUser) {
      // Logged-in users → check DB for ongoing attempt
      const existingQuiz = (await withRls(session, (tx) =>
        tx.userQuizInProgress.findFirst({
          where: { userId: session!.user!.id, quiz: { slug: params.slug } },
          include: {
            quiz: {
              include: {
                quizQuestion: true,
                lesson: { include: { unit: true } },
                tagging: { include: { tag: true } },
              },
            },
          },
        }),
      )) as {
        quiz: {
          id: string;
          title: string;
          slug: string;
          quizQuestion: any[];
          lesson: any;
          tagging: any[];
        } | null;
      };

      if (existingQuiz) {
        return NextResponse.json({
          quiz: existingQuiz.quiz,
          rateLimited: false,
          remaining: 0,
        });
      }
    } else {
      // Guests → check Redis cache
      const cached = await getRedisCache(cacheKey);
      if (cached) {
        return NextResponse.json({
          quiz: cached,
          rateLimited: false,
          remaining: 0,
        });
      }
    }

    const { allowed, remaining } = await rateLimit(
      key,
      TIER_LIMITS[tier].max,
      TIER_LIMITS[tier].window,
    );

    if (!allowed) {
      // Nothing cached / found
      return NextResponse.json(
        { rateLimited: true, remaining },
        { status: 429 },
      );
    }

    // No active quiz — create one
    const quiz = await withRls(session, async (tx) => {
      return tx.quiz.findUnique({
        where: { slug: params.slug },
        include: {
          quizQuestion: true,
          lesson: { include: { unit: true } },
          tagging: { include: { tag: true } },
        },
      });
    });

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    const randomizedQuiz = generateRandomQuiz(quiz);
    // Create save entry in DB
    if (isUser) {
      await withRls(session, async (tx) => {
        tx.userQuizInProgress.create({
          data: {
            user: { connect: { id: session.user.id } },
            quiz: { connect: { id: quiz.id } },
            expires: new Date(Date.now() + TIER_LIMITS.user.window * 1000),
            quizQuestion: {
              connect: randomizedQuiz.quizQuestion.map((question) => ({
                id: question.id,
              })),
            },
          },
        });
      });
    } else {
      await setRedisCache(cacheKey, randomizedQuiz, TIER_LIMITS.guest.window);
    }

    return NextResponse.json({
      quiz: randomizedQuiz,
      rateLimited: false,
      remaining,
    });
  } catch (error) {
    console.error("Error finding specific quiz by slug:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;
  const { slug } = params;

  try {
    const session = await getServerSession(authOptions);
    const ip = getClientIp(req);

    const tier = session?.user ? "user" : "guest";
    const isUser = !!session?.user?.id;
    const key = session?.user?.id
      ? `quiz:post:${session.user.id}`
      : `quiz:post:${ip}`;

    const { allowed, remaining } = await rateLimit(
      key,
      TIER_LIMITS[tier].max,
      TIER_LIMITS[tier].window,
    );

    if (!allowed) {
      return NextResponse.json(
        { rateLimited: true, remaining },
        { status: 429 },
      );
    }

    const cacheKey = `quiz_in_progress:quiz:get:${ip}:${params.slug}`;
    const body = await req.json();

    // Submitted answers (may be fewer than shown questions)
    const submittedAnswers: SubmittedAnswer[] = Object.entries(
      body.answers ?? {},
    ).map(([questionId, answer]) => ({
      questionId,
      answer: answer as string | boolean | MatchingAnswer[],
    }));

    const allQuestionIds: string[] = body.questionIds ?? [];

    // Fetch all questions shown to the user
    const quiz = await withRls(
      session,
      (
        tx,
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
        }),
    );

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    const orderedQuestions = allQuestionIds
      .map((id) => quiz.quizQuestion.find((q) => q.id === id))
      .filter(Boolean) as QuizQuestionType[];

    // Grade all questions
    const { results, totalCorrect, totalPossible } = gradeQuiz(
      orderedQuestions,
      submittedAnswers,
    );

    // Save attempt if user is logged in
    if (isUser) {
      await withRls(session, (tx) =>
        tx.userQuizAttempt.create({
          data: {
            score: totalCorrect,
            passed: totalCorrect / totalPossible >= 0.5,
            user: { connect: { id: session.user.id } },
            quiz: { connect: { id: quiz.id } },
          },
        }),
      );
      await withRls(session, (tx) =>
        tx.userQuizInProgress.deleteMany({
          where: { userId: session.user.id, quizId: quiz.id },
        }),
      );
    } else {
      // Guests → remove cached quiz from Redis
      await delRedis(cacheKey);
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
