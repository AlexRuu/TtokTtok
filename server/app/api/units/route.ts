import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { unitsSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const units = await prismadb.unit.findMany({
      include: { lesson: { orderBy: { lessonNumber: "asc" } } },
      orderBy: { unitNumber: "asc" },
    });

    return NextResponse.json(units);
  } catch (error) {
    console.log("Error fetching units.", error);
    return new NextResponse("Error fetching units", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = unitsSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid tag data", { status: 400 });
    }

    const { title } = parsed.data;

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
