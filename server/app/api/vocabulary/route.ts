import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { vocabularySchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const parsed = vocabularySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Missing vocabulary data", { status: 400 });
    }

    const { title, vocabulary, lessonId } = parsed.data;

    if (!lessonId) {
      return new NextResponse("Lesson is required", { status: 400 });
    }

    const existingList = await prismadb.vocabularyList.findFirst({
      where: {
        title: title,
        lessonId: lessonId,
      },
    });

    if (existingList) {
      await prismadb.vocabulary.createMany({
        data: vocabulary.map((item) => ({
          english: item.english,
          korean: item.korean,
          definition: item.definition,
          vocabularyListId: existingList.id,
        })),
      });

      return new NextResponse("Successfully added new vocabulary to list", {
        status: 201,
      });
    }

    const vocabTag = await prismadb.tag.findUnique({
      where: { name: "Vocabulary" },
    });

    if (!vocabTag) {
      return new NextResponse("Could not find Vocabulary Tag", { status: 409 });
    }

    await prismadb.$transaction(async (tx) => {
      const vocabularyList = await tx.vocabularyList.create({
        data: {
          title: title,
          lesson: { connect: { id: lessonId } },
          vocabulary: {
            createMany: {
              data: vocabulary.map((item) => ({
                english: item.english,
                korean: item.korean,
                definition: item.definition,
              })),
            },
          },
        },
      });

      await tx.tagging.create({
        data: {
          tagId: vocabTag.id,
          vocabularyListId: vocabularyList.id,
        },
      });
    });

    return NextResponse.json("Successfully created vocabulary", {
      status: 201,
    });
  } catch (error) {
    console.log("Error creating vocabulary", error);
    return new NextResponse("Error POSTing vocabulary", { status: 500 });
  }
}
