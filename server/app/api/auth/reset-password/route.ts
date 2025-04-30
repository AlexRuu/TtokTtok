import prismadb from "@/lib/prismadb";
import { hash } from "argon2";
import { isBefore } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Retrieve data sent from client
    const body = await req.json();

    const { token, password, confirmPassword } = body;

    // Check if token is passed
    if (!token) {
      return new NextResponse("No token provided", { status: 401 });
    }

    // Check if there is such token
    const resetToken = await prismadb.forgotPasswordToken.findFirst({
      where: {
        token: token,
      },
    });

    // Stop function if token is not valid/found/
    if (
      !resetToken ||
      resetToken.used ||
      isBefore(new Date(resetToken.expires), new Date())
    ) {
      return new NextResponse("Token is expired or is not valid", {
        status: 401,
      });
    }

    // Check if there are incoming passwords
    if (password && confirmPassword) {
      // Check if incoming passwords match
      if (password !== confirmPassword) {
        return new NextResponse("Password does not match", { status: 401 });
      }

      // Hash password and update database
      const hashedNewPassword = await hash(password);

      await prismadb.user.update({
        where: { email: resetToken.identifier },
        data: {
          password: hashedNewPassword,
        },
      });

      await prismadb.forgotPasswordToken.update({
        where: { token: token },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Error retrieving reset password token", {
      status: 500,
    });
  }
}
