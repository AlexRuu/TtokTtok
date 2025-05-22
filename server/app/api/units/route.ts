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
    const { title } = body;
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    await prismadb.unit.create({
      data: {
        title: title,
      },
    });

    return NextResponse.json({
      message: "Successfully created unit",
      status: 200,
    });
  } catch (error) {
    console.log("Error creating unit", error);
    return new NextResponse("Error creating unit", { status: 500 });
  }
}
