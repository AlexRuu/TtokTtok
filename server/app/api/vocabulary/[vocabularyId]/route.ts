import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { vocabularySchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { vocabularyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const vocabularyId = params.vocabularyId;
    const parsed = vocabularySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid vocabulary data", { status: 400 });
    }

    const { english, korean, definition, lessonId } = parsed.data;

    const existingVocabulary = await prismadb.vocabulary.findUnique({
      where: { id: vocabularyId },
    });

    if (!existingVocabulary) {
      return new NextResponse("Vocabulary does not exist", { status: 404 });
    }

    await prismadb.vocabulary.update({
      where: { id: vocabularyId },
      data: {
        english: english,
        korean: korean,
        definition: definition,
        lessonId: lessonId,
      },
    });

    return new NextResponse("Successfully updated vocabulary", { status: 200 });
  } catch (error) {
    console.error("There was an error updating vocabulary", error);
    return new NextResponse("There was an error updating vocabulary", {
      status: 500,
    });
  }
}
