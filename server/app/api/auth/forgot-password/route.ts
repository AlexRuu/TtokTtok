import prismadb from "@/lib/prismadb";
import { SendResetPasswordEmail } from "@/lib/resetPasswordEmail";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Please provide an email", { status: 401 });
    }

    const user = await prismadb.user.findFirst({ where: { email: email } });

    if (!user || !user.emailVerified) {
      return new NextResponse("User does not exist or is not verified", {
        status: 401,
      });
    }

    const resetPasswordToken = nanoid(32);

    await prismadb.forgotPasswordToken.create({
      data: {
        identifier: user.email,
        token: resetPasswordToken,
        userId: user.id,
        expires: addMinutes(new Date(), 10),
      },
    });

    await SendResetPasswordEmail(email, resetPasswordToken);

    return new NextResponse("Reset password email has been sent", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error sending reset password email", {
      status: 500,
    });
  }
}
