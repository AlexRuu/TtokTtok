import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { unitsSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: { params: Promise<{ unitId: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const unitId = params.unitId;
    const parsed = unitsSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid unit data", { status: 400 });
    }

    const { title } = parsed.data;

    const existingUnit = await prismadb.unit.findUnique({
      where: { id: unitId },
    });

    if (!existingUnit) {
      return new NextResponse("Unit does not exist", { status: 404 });
    }

    await prismadb.unit.update({
      where: { id: unitId },
      data: {
        title: title,
      },
    });

    return new NextResponse("Successfully updated tag", { status: 200 });
  } catch (error) {
    console.error("There was an error updating tag", error);
    return new NextResponse("There was an error updating tag", { status: 500 });
  }
}
