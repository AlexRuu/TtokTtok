import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/rateLimit";
import { withRls } from "@/lib/withRLS";
import { resetPasswordSchema } from "@/schemas/form-schemas";
import { Prisma } from "@prisma/client";
import { hash, verify } from "argon2";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    const allowed = await rateLimit(ip, 5, 60);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }

    const session = await getServerSession(authOptions);

    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { token, password, confirmPassword } = parsed.data;

    if (!password || !confirmPassword) {
      return new NextResponse("Missing password or confirmed password", {
        status: 400,
      });
    }

    if (password !== confirmPassword) {
      return new NextResponse("Password does not match", { status: 400 });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return new NextResponse("Password does not meet security requirements", {
        status: 400,
      });
    }

    // Fetch tokens that are not used and not expired
    return await withRls(session, async (tx) => {
      const potentialTokens = await tx.forgotPasswordToken.findMany({
        where: {
          used: false,
          expires: { gt: new Date() },
        },
      });

      let validToken = null;
      for (const t of potentialTokens) {
        const isMatch = await verify(t.token, token);
        if (isMatch) {
          validToken = t;
          break;
        }
      }

      if (!validToken) {
        return new NextResponse("Token is expired or invalid", { status: 400 });
      }

      const user = await tx.user.findUnique({
        where: { email: validToken.identifier },
      });

      if (!user) {
        return new NextResponse("Invalid or expired reset link", {
          status: 401,
        });
      }

      const hashedNewPassword = await hash(password);

      await tx.$transaction(async (trx: Prisma.TransactionClient) => {
        await trx.user.update({
          where: { email: validToken.identifier },
          data: {
            password: hashedNewPassword,
          },
        });

        await trx.forgotPasswordToken.update({
          where: { id: validToken.id },
          data: {
            used: true,
            usedAt: new Date(),
          },
        });
      });

      await tx.forgotPasswordToken.deleteMany({
        where: {
          OR: [{ expires: { lt: new Date() } }, { used: true }],
        },
      });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    console.error("Internal server error during password reset:", error);
    return new NextResponse("Internal server error during password reset", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const allowed = await rateLimit(ip, 5, 60);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Link has expired or is no longer available", {
        status: 404,
      });
    }
    return await withRls(session, async (tx) => {
      const potentialTokens = await tx.forgotPasswordToken.findMany({
        where: {
          used: false,
          expires: { gt: new Date() },
        },
      });
      let validToken = null;

      for (const t of potentialTokens) {
        const isMatch = await verify(t.token, token);
        if (isMatch) {
          validToken = t;
          break;
        }
      }

      if (!validToken) {
        return new NextResponse("Token is expired or invalid", { status: 400 });
      }

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return new NextResponse("Internal server error during password reset", {
      status: 500,
    });
  }
}
