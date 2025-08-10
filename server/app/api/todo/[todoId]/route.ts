import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ todoId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const todoId = params.todoId;
    return await withRls(session, async (tx) => {
      const existingItem = await tx.todo.findUnique({
        where: { id: todoId },
      });

      if (!existingItem) {
        return new NextResponse("Item does not exist in the Todo List", {
          status: 404,
        });
      }

      await tx.todo.update({
        where: { id: todoId },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      return new NextResponse("Successfully marked item as completed", {
        status: 200,
      });
    });
  } catch (error) {
    console.error("Error updating todo list item", error);
    return new NextResponse("Error updating todo list item", { status: 500 });
  }
}
