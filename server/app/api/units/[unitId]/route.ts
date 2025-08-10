import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { withRls } from "@/lib/withRLS";
import { unitsSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ unitId: string }> }
) {
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

    return await withRls(session, async (tx) => {
      const existingUnit = await tx.unit.findUnique({
        where: { id: unitId },
      });

      if (!existingUnit) {
        return new NextResponse("Unit does not exist", { status: 404 });
      }

      await tx.unit.update({
        where: { id: unitId },
        data: {
          title: title,
        },
      });

      return new NextResponse("Successfully updated unit", { status: 200 });
    });
  } catch (error) {
    console.error("There was an error updating unit", error);
    return new NextResponse("There was an error updating unit", {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ unitId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const unitId = params.unitId;

    return await withRls(session, async (tx) => {
      const existingUnit = await tx.unit.findUnique({
        where: { id: unitId },
      });

      if (!existingUnit) {
        return new NextResponse("Unit does not exist", { status: 404 });
      }

      await tx.unit.delete({
        where: { id: unitId },
      });

      return new NextResponse("Unit was successfully deleted", { status: 200 });
    });
  } catch (error) {
    console.error("There was an error deleting unit", error);
    return new NextResponse("There was an error deleting unit", {
      status: 500,
    });
  }
}
