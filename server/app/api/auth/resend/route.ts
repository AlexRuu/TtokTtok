import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/redis";
import { sendVerificationEmail } from "@/lib/verificationEmail";
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

    const allowed = await rateLimit(ip, 5, 60);

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
      return new NextResponse("No Email", { status: 404 });
    }

    const allowedByEmail = await rateLimit(`forgot_password:${email}`, 5, 900);

    if (!allowedByEmail) {
      return new Response("Too many requests", { status: 429 });
    }

    return await withRls(session, async (tx) => {
      const user = await tx.user.findFirst({
        where: { email: email },
      });

      if (!user) {
        return new NextResponse("User does not exist", { status: 404 });
      }

      if (user.emailVerified) {
        return new NextResponse("User is already verified", { status: 400 });
      }

      const recentToken = await tx.verificationToken.findFirst({
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
      const hashedNewPassword = await hash(emailVerificationToken);
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: hashedNewPassword,
          userId: user.id,
          expires: addMinutes(new Date(), 10),
        },
      });

      const tokens = await tx.verificationToken.findMany({
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
        const toDelete = tokens.map((t: { id: string }) => t.id);
        await tx.verificationToken.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      return new NextResponse("Sent new email to user", { status: 200 });
    });
  } catch (error) {
    console.error("Unable to retrieve email", error);
    return new NextResponse("Unable to retrieve email", { status: 404 });
  }
}
