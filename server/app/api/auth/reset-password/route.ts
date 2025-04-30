import prismadb from "@/lib/prismadb";
import { hash } from "argon2";
import { isBefore } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Retrieve data sent from client
    const body = await req.json();

    const { token, password, confirmPassword } = body;

    const strongEnough =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

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

    const user = await prismadb.user.findUnique({
      where: { email: resetToken.identifier },
    });

    if (!user) {
      return new NextResponse("Invalid or expired reset link", { status: 401 });
    }

    if (!password || !confirmPassword) {
      return new NextResponse("Missing password or confirmed password", {
        status: 400,
      });
    }

    // Check if incoming passwords match
    if (password !== confirmPassword) {
      return new NextResponse("Password does not match", { status: 400 });
    }

    if (!strongEnough.test(password)) {
      return new NextResponse("Password does not meet security requirements", {
        status: 400,
      });
    }

    // Hash password and update database
    const hashedNewPassword = await hash(password);

    await prismadb.$transaction([
      prismadb.user.update({
        where: { email: resetToken.identifier },
        data: {
          password: hashedNewPassword,
        },
      }),
      prismadb.forgotPasswordToken.update({
        where: { token: token },
        data: {
          used: true,
          usedAt: new Date(),
        },
      }),
    ]);

    const tokens = await prismadb.verificationToken.findMany({
      where: {
        identifier: user.email,
      },
      orderBy: {
        expires: "desc",
      },
      skip: 5,
    });

    if (tokens.length > 0) {
      const toDelete = tokens.map((t) => t.id);
      await prismadb.verificationToken.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal server error during password reset", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Link has expired or is no longer available", {
        status: 404,
      });
    }

    const validToken = await prismadb.forgotPasswordToken.findFirst({
      where: {
        token: token,
      },
    });

    if (
      !validToken ||
      validToken.used ||
      isBefore(new Date(validToken.expires), new Date())
    ) {
      return new NextResponse("Token is expired or is not valid", {
        status: 401,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal server error during password reset", {
      status: 500,
    });
  }
}
