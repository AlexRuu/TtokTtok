import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ savedVocab: [] }, { status: 401 });
    }
    return await withRls(session, async (tx) => {
      const savedVocab = await tx.savedVocabulary.findMany({
        where: { userId: session.user.id },
        select: { vocabularyId: true },
      });

      return NextResponse.json({ savedVocab });
    });
  } catch (error) {
    console.error("Failed to retrieve user's saved vocabulary", error);
    return NextResponse.json(
      { message: "Failed to retrieve user's saved vocabulary" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { vocabulary } = await req.json();

    if (!vocabulary || !vocabulary.id) {
      return NextResponse.json(
        { message: "Missing vocabulary data for save" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    return await withRls(session, async (tx) => {
      await tx.savedVocabulary.upsert({
        where: {
          userId_vocabularyId: {
            userId,
            vocabularyId: vocabulary.id,
          },
        },
        create: {
          userId,
          vocabularyId: vocabulary.id,
        },
        update: {},
      });

      return NextResponse.json(
        { message: "Successfully saved vocabulary" },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("Failed to save vocabulary to profile", error);
    return NextResponse.json(
      { message: "Failed to save vocabulary to profile" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { vocabulary } = await req.json();

    if (!vocabulary || !vocabulary.id) {
      return NextResponse.json(
        { message: "Missing vocabulary data for delete" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    return await withRls(session, async (tx) => {
      await tx.savedVocabulary.delete({
        where: {
          userId_vocabularyId: {
            userId,
            vocabularyId: vocabulary.id,
          },
        },
      });

      return NextResponse.json(
        { message: "Successfully removed saved vocabulary" },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("There was an error removing the saved vocabulary", error);
    return NextResponse.json(
      { message: "There was an error removing the saved vocabulary" },
      { status: 500 },
    );
  }
}
