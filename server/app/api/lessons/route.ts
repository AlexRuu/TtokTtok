import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { lessonNumber, title, unitTitle, blocks } = body;

    return new NextResponse("Successfully added lesson", { status: 200 });
  } catch (error) {
    console.log("Error creating lesson", error);
    return new NextResponse("There was an error posting lesson", {
      status: 500,
    });
  }
}
