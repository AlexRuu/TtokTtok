import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    if (!body) {
      return new NextResponse("Insufficient data required", { status: 400 });
    }

    const { firstName, lastName, email, role } = body;
    const { id } = await params;
    await prismadb.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
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
