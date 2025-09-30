import { NextResponse } from "next/server";
import { withRls } from "@/lib/withRLS";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  try {
    const metadata = await withRls(null, async (tx) =>
      tx.quiz.findUnique({
        where: { slug: params.slug },
        select: {
          title: true,
          slug: true,
          lesson: { select: { id: true, title: true, unitId: true } },
          tagging: { select: { tag: { select: { id: true, name: true } } } },
        },
      })
    );

    if (!metadata) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    return NextResponse.json(metadata, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching quiz metadata:", error);
    return new NextResponse("Error fetching quiz metadata", { status: 500 });
  }
}
