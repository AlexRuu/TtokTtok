import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { Status } from "@/lib/generated/prisma";
import { withRls } from "@/lib/withRLS";

export async function DELETE(_req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expireDate = subDays(new Date(), 30);

    return await withRls(session, async (tx) => {
      const deleted = await tx.user.deleteMany({
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
    });
  } catch (error) {
    console.error("There was an error deleting inactive users", error);
    return new NextResponse(
      "There was an error trying to delete inactive users",
      { status: 500 }
    );
  }
}
