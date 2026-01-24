import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { tagSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
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

    return await withRls(session, async (tx) => {
      await tx.tag.create({
        data: {
          name: capitalizeFirstLetter(name),
          backgroundColour: backgroundColour,
          textColour: textColour,
          borderColour: borderColour,
        },
      });

      revalidatePath("/tags");

      return NextResponse.json({
        message: "Successfully created unit",
        status: 200,
      });
    });
  } catch (error) {
    console.error("Error creating unit", error);
    return new NextResponse("Error creating unit", { status: 500 });
  }
}

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    return await withRls(session, async (tx) => {
      const tags = await tx.tag.findMany({});

      if (!tags) {
        return new NextResponse("There are no tags available", { status: 400 });
      }

      return NextResponse.json(tags);
    });
  } catch (error) {
    console.error("Error fetching all tags", error);
    return new NextResponse("Error fetching all tags", { status: 500 });
  }
}
