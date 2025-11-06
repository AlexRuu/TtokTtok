import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/redis";
import { SendResetPasswordEmail } from "@/lib/resetPasswordEmail";
import { withRls } from "@/lib/withRLS";
import { forgotPasswordFormSchema } from "@/schemas/form-schemas";
import { hash } from "argon2";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    const allowed = await rateLimit(ip, 5, 900);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const body = await req.json();

    const parsed = forgotPasswordFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { email } = parsed.data;

    if (!email) {
      return new NextResponse("Please provide an email", { status: 401 });
    }

    const allowedByEmail = await rateLimit(`forgot_password:${email}`, 5, 900);

    if (!allowedByEmail) {
      return new Response("Too many requests", { status: 429 });
    }

    return await withRls(session, async (tx) => {
      const user = await tx.user.findFirst({ where: { email: email } });

      if (!user || !user.emailVerified) {
        return new NextResponse("User does not exist or is not verified", {
          status: 401,
        });
      }

      const resetPasswordToken = nanoid(32);
      const hashedPasswordToken = await hash(resetPasswordToken);

      await tx.forgotPasswordToken.create({
        data: {
          identifier: user.email,
          token: hashedPasswordToken,
          userId: user.id,
          expires: addMinutes(new Date(), 10),
        },
      });

      await SendResetPasswordEmail(email, resetPasswordToken);

      return new NextResponse("Reset password email has been sent", {
        status: 200,
      });
    });
  } catch (error) {
    return new NextResponse("Error sending reset password email", {
      status: 500,
    });
  }
}
