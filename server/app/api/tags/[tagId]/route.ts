import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { tagSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ tagId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const tagId = params.tagId;
    const parsed = tagSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid tag data", { status: 400 });
    }

    const { name, backgroundColour, textColour, borderColour } = parsed.data;

    const existingTag = await prismadb.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      return new NextResponse("Tag does not exist", { status: 404 });
    }

    await prismadb.tag.update({
      where: { id: tagId },
      data: {
        name: name,
        backgroundColour: backgroundColour,
        textColour: textColour,
        borderColour: borderColour,
      },
    });

    return new NextResponse("Successfully updated tag", { status: 200 });
  } catch (error) {
    console.error("There was an error updating tag", error);
    return new NextResponse("There was an error updating tag", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ tagId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const tagId = params.tagId;

    const existingTag = await prismadb.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      return new NextResponse("Tag does not exist", { status: 404 });
    }

    await prismadb.tag.delete({
      where: { id: tagId },
    });

    return new NextResponse("Tag was successfully deleted", { status: 200 });
  } catch (error) {
    console.error("There was an error deleting tag", error);
    return new NextResponse("There was an error deleting tag", {
      status: 500,
    });
  }
}
