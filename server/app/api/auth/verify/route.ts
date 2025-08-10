import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/rateLimit";
import { withRls } from "@/lib/withRLS";
import { verifySchema } from "@/schemas/form-schemas";
import { Prisma } from "@prisma/client";
import { verify } from "argon2";
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
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { token } = parsed.data;

    return await withRls(session, async (tx) => {
      const potentialTokens = await tx.verificationToken.findMany({
        where: {
          used: false,
          expires: { gt: new Date() },
          createdAt: { gte: new Date(Date.now() - 1000 * 60 * 10) },
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
        return NextResponse.json(
          { message: "Token is expired or invalid" },
          { status: 400 }
        );
      }

      await tx.$transaction(async (trx: Prisma.TransactionClient) => {
        await trx.user.update({
          where: { email: validToken.identifier },
          data: { emailVerified: new Date() },
        });

        await trx.verificationToken.update({
          where: { id: validToken.id },
          data: {
            used: true,
            usedAt: new Date(),
          },
        });
      });

      await tx.verificationToken.deleteMany({
        where: {
          OR: [{ expires: { lt: new Date() } }, { used: true }],
        },
      });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Error verifying user" },
      { status: 500 }
    );
  }
}
