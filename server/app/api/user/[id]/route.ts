import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(body, params.id);
    return NextResponse.json({
      message: "Successfully updated user",
      status: 200,
    });
  } catch (error) {
    console.log("Error updating user", error);
    return new NextResponse("Error updating user", { status: 500 });
  }
}
