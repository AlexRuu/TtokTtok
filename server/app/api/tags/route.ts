import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { tagSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + String(val).slice(1);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = tagSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid tag data", { status: 400 });
    }

    const { name, backgroundColour, textColour, borderColour } = parsed.data;

    await prismadb.tag.create({
      data: {
        name: capitalizeFirstLetter(name),
        backgroundColour: backgroundColour,
        textColour: textColour,
        borderColour: borderColour,
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
