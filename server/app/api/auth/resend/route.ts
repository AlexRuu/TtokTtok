import prismadb from "@/lib/prismadb";
import { sendVerificationEmail } from "@/lib/verificationEmail";
import { forgotPasswordFormSchema } from "@/schemas/form-schemas";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { email } = parsed.data;

    if (!email) {
      return new NextResponse("No Email", { status: 404 });
    }

    const user = await prismadb.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return new NextResponse("User does not exist", { status: 404 });
    }

    if (user.emailVerified) {
      return new NextResponse("User is already verified", { status: 400 });
    }

    const recentToken = await prismadb.verificationToken.findFirst({
      where: {
        identifier: email,
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60),
        },
      },
    });

    if (recentToken) {
      return new NextResponse(
        "You can only request a new verification email once per minute.",
        { status: 400 }
      );
    }

    const emailVerificationToken = nanoid(32);

    await prismadb.verificationToken.create({
      data: {
        identifier: email,
        token: emailVerificationToken,
        userId: user.id,
        expires: addMinutes(new Date(), 10),
      },
    });

    const tokens = await prismadb.verificationToken.findMany({
      where: {
        identifier: email,
      },
      orderBy: {
        expires: "desc",
      },
      skip: 5,
    });

    await sendVerificationEmail(email, emailVerificationToken);

    if (tokens.length > 0) {
      const toDelete = tokens.map((t) => t.id);
      await prismadb.verificationToken.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return new NextResponse("Sent new email to user", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Unable to retrieve email", { status: 404 });
  }
}
