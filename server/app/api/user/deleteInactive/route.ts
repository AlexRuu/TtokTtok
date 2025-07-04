import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { Status } from "@/lib/generated/prisma";

export async function DELETE(_req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("here");
    const expireDate = subDays(new Date(), 30);

    const deleted = await prismadb.user.deleteMany({
      where: {
        status: Status.INACTIVE,
        updatedAt: {
          lt: expireDate,
        },
      },
    });

    return new NextResponse(
      `Deleted ${deleted.count} users who requested account deletion.`,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("There was an error deleting inactive users", error);
    return new NextResponse(
      "There was an error trying to delete inactive users",
      { status: 500 }
    );
  }
}
