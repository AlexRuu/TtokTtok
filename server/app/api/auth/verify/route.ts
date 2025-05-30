import prismadb from "@/lib/prismadb";
import { verifySchema } from "@/schemas/form-schemas";
import { isBefore } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { token } = parsed.data;

    const validToken = await prismadb.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (
      !validToken ||
      validToken.used ||
      isBefore(new Date(validToken.expires), new Date())
    ) {
      return new NextResponse("Token is expired or invalid", { status: 400 });
    }

    await prismadb.user.update({
      where: { email: validToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prismadb.verificationToken.update({
      where: { token: token },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Error verifying user", { status: 500 });
  }
}
