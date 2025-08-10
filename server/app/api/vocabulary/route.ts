import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { vocabularySchema } from "@/schemas/form-schemas";
import { Prisma } from "@prisma/client";
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

    return await withRls(session, async (tx) => {
      const existingList = await tx.vocabularyList.findFirst({
        where: {
          title: title,
          lessonId: lessonId,
        },
      });

      if (existingList) {
        await tx.vocabulary.createMany({
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

      const vocabTag = await tx.tag.findUnique({
        where: { name: "Vocabulary" },
      });

      if (!vocabTag) {
        return new NextResponse("Could not find Vocabulary Tag", {
          status: 409,
        });
      }
      await tx.$transaction(async (trx: Prisma.TransactionClient) => {
        const vocabularyList = await trx.vocabularyList.create({
          data: {
            title,
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

        await trx.tagging.create({
          data: {
            tagId: vocabTag.id,
            vocabularyListId: vocabularyList.id,
          },
        });
      });
      return NextResponse.json("Successfully created vocabulary", {
        status: 201,
      });
    });
  } catch (error) {
    console.log("Error creating vocabulary", error);
    return new NextResponse("Error POSTing vocabulary", { status: 500 });
  }
}
