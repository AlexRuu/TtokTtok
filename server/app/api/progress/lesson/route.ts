import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { withRls } from "@/lib/withRLS";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      lessonId,
      viewedBlocks = [],
      percentage = 0,
    } = body as {
      lessonId: string;
      viewedBlocks?: number[];
      percentage?: number;
    };

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    // fetch user
    return await withRls(session, async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      // get existing progress if any
      const existing = await tx.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId } },
      });

      // merge viewed blocks (unique)
      const mergedSet = new Set<number>();
      if (existing?.viewedBlocks?.length)
        existing?.viewedBlocks?.forEach((n: number) => mergedSet.add(n));
      viewedBlocks.forEach((n: number) => mergedSet.add(n));
      const merged = Array.from(mergedSet).sort((a, b) => a - b);

      const finalPercentage = Math.max(
        existing?.percentage ?? 0,
        Number(percentage ?? 0)
      );

      const data = {
        viewedBlocks: merged,
        percentage: finalPercentage,
        updatedAt: new Date(),
        startedAt: existing?.startedAt ?? new Date(),
        completedAt:
          finalPercentage >= 100 ? new Date() : (existing?.completedAt ?? null),
      };

      const upserted = await tx.userLessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        create: {
          userId: user.id,
          lessonId,
          viewedBlocks: merged,
          percentage: finalPercentage,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
        },
        update: {
          viewedBlocks: merged,
          percentage: finalPercentage,
          completedAt: data.completedAt,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, progress: upserted });
    });
  } catch (err) {
    console.error("progress.patch.err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Not logged in? Just return null (client will fall back to localStorage)
    if (!session?.user?.email) {
      return NextResponse.json(null, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(null, { status: 200 });
    }

    return await withRls(session, async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (!user) return NextResponse.json(null, { status: 200 });

      const progress = await tx.userLessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId,
          },
        },
        select: {
          viewedBlocks: true,
          percentage: true,
          completedAt: true,
        },
      });

      return NextResponse.json(progress ?? null);
    });
  } catch (err) {
    console.error("progress.get.err", err);
    return NextResponse.json(null, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
