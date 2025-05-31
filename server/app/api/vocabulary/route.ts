import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { definition, lessonId } = body;

    const english = body.english.trim();
    const korean = body.korean.trim();

    if (!english || !korean || !definition || !lessonId) {
      return new NextResponse("Missing one or more values to create", {
        status: 400,
      });
    }

    const existingVocab = await prismadb.vocabulary.findFirst({
      where: { lessonId, english, korean },
    });

    if (existingVocab) {
      return new NextResponse("The vocabulary aready exists", { status: 409 });
    }

    await prismadb.vocabulary.create({
      data: {
        english,
        korean,
        definition,
        lesson: {
          connect: { id: lessonId },
        },
      },
    });

    return NextResponse.json("Successfully created vocabulary", {
      status: 200,
    });
  } catch (error) {
    console.log("Error creating vocabulary", error);
    return new NextResponse("Error POSTing vocabulary", { status: 500 });
  }
}
