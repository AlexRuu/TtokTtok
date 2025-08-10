import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { todoSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = todoSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid tag data", { status: 400 });
    }

    const { title } = parsed.data;
    return await withRls(session, async (tx) => {
      await tx.todo.create({
        data: {
          title: title,
          completed: false,
        },
      });

      return new NextResponse("Successfully created todo item", {
        status: 200,
      });
    });
  } catch (error) {
    console.error("There was an error trying to create the todo item", error);
    return new NextResponse(
      "There was an error trying to create the todo item",
      { status: 500 }
    );
  }
}

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return await withRls(session, async (tx) => {
      const list = await tx.todo.findMany({
        where: {
          completed: false,
        },
        orderBy: { createdAt: "asc" },
      });

      await tx.todo.deleteMany({
        where: {
          completed: true,
          completedAt: {
            not: null,
          },
        },
      });

      return NextResponse.json(list);
    });
  } catch (error) {
    console.error("Error getting todo list", error);
    return new NextResponse("Error getting todo list", { status: 500 });
  }
}
