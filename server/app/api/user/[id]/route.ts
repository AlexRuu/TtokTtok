import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { editUserSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const parsed = editUserSchema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }
    const { firstName, lastName, email, role, status } = parsed.data;
    const id = params.id;
    return await withRls(session, async (tx) => {
      await tx.user.update({
        where: { id },
        data: { firstName, lastName, email, status, role },
      });
      return new NextResponse("Successfully updated user", { status: 200 });
    });
  } catch (error) {
    console.error("Error updating user", error);
    return new NextResponse("Error updating user", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;

    return await withRls(session, async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return new NextResponse("User does not exist", { status: 404 });
      }

      await tx.user.delete({
        where: { id: userId },
      });

      return new NextResponse("User was successfully deleted", { status: 200 });
    });
  } catch (error) {
    console.error("There was an error deleting user", error);
    return new NextResponse("There was an error deleting user", {
      status: 500,
    });
  }
}
