import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    if (!body) {
      return new NextResponse("Insufficient data required", { status: 400 });
    }
    const id = params.id;
    const { firstName, lastName, email, role, status } = body;

    await prismadb.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        status: status,
        role: role,
      },
    });

    return NextResponse.json({
      message: "Successfully updated user",
      status: 200,
    });
  } catch (error) {
    console.log("Error updating user", error);
    return new NextResponse("Error updating user", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;

    const existingUser = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new NextResponse("User does not exist", { status: 404 });
    }

    await prismadb.user.delete({
      where: { id: userId },
    });

    return new NextResponse("User was successfully deleted", { status: 200 });
  } catch (error) {
    console.error("There was an error deleting user", error);
    return new NextResponse("There was an error deleting user", {
      status: 500,
    });
  }
}
