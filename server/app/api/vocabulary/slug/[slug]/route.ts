import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;

  try {
    const session = await getServerSession(authOptions);
    return await withRls(session, async (tx) => {
      const vocabulary = await tx.vocabularyList.findFirst({
        where: {
          lesson: {
            slug: params.slug,
          },
        },
        include: {
          vocabulary: true,
          lesson: {
            include: {
              unit: true,
            },
          },
        },
      });
      if (!vocabulary) {
        return new NextResponse(
          "There are no vocabularies associated with this lesson",
          { status: 404 },
        );
      }

      return NextResponse.json(vocabulary);
    });
  } catch (error) {
    console.error("Error fetching vocabulary for lesson", error);
    return new NextResponse("Error fetching lesson's vocabulary list", {
      status: 500,
    });
  }
}
