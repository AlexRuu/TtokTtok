import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { vocabularySchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ vocabularyListId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const vocabularyId = params.vocabularyListId;
    const parsed = vocabularySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid vocabulary data", { status: 400 });
    }

    const { vocabulary } = parsed.data;

    const existingVocabulary = await prismadb.vocabularyList.findUnique({
      where: { id: vocabularyId },
    });

    if (!existingVocabulary) {
      return new NextResponse("Vocabulary does not exist", { status: 404 });
    }

    await prismadb.vocabulary.deleteMany({
      where: { vocabularyListId: vocabularyId },
    });

    await prismadb.vocabulary.createMany({
      data: vocabulary.map((item) => ({
        english: item.english,
        korean: item.korean,
        definition: item.definition,
        vocabularyListId: vocabularyId,
      })),
    });

    return new NextResponse("Successfully updated vocabulary", { status: 200 });
  } catch (error) {
    console.error("There was an error updating vocabulary", error);
    return new NextResponse("There was an error updating vocabulary", {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ vocabularyListId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const vocabularyListId = params.vocabularyListId;

    const existingVocabulary = await prismadb.vocabularyList.findUnique({
      where: { id: vocabularyListId },
    });

    if (!existingVocabulary) {
      return new NextResponse("Vocabulary list does not exist", {
        status: 404,
      });
    }

    await prismadb.vocabularyList.delete({
      where: { id: vocabularyListId },
    });

    return new NextResponse("Vocabulary list was successfully deleted", {
      status: 200,
    });
  } catch (error) {
    console.error("There was an error deleting vocabulary list", error);
    return new NextResponse("There was an error deleting vocabulary list", {
      status: 500,
    });
  }
}
