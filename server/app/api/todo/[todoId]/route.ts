import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
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

    const existingItem = await prismadb.todo.findUnique({
      where: { id: todoId },
    });

    if (!existingItem) {
      return new NextResponse("Item does not exist in the Todo List", {
        status: 404,
      });
    }

    await prismadb.todo.update({
      where: { id: todoId },
      data: {
        completed: true,
      },
    });

    return new NextResponse("Successfully marked item as completed", {
      status: 200,
    });
  } catch (error) {
    console.log("Error updating todo list item", error);
    return new NextResponse("Error updating todo list item", { status: 500 });
  }
}
