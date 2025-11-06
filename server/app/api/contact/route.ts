import { authOptions } from "@/lib/auth";
import { getClientIp } from "@/lib/getIP";
import { rateLimit } from "@/lib/redis";
import { withRls } from "@/lib/withRLS";
import { contactFormSchema } from "@/schemas/form-schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    const allowed = await rateLimit(ip, 1, 60);

    if (!allowed) {
      return new Response("Too many requests", { status: 429 });
    }
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }
    const { firstName, lastName, email, subject, message, honeypot } =
      parsed.data;

    if (honeypot?.trim() !== "") {
      console.warn("Bot submission detected:", {
        ip: req.headers.get("x-forwarded-for"),
      });
      return new NextResponse("Bot detected", { status: 400 });
    }
    return await withRls(session, async (tx) => {
      await tx.contactMessage.create({
        data: {
          firstName,
          lastName,
          email,
          subject,
          message,
        },
      });

      return NextResponse.json({ message: "Success" });
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new NextResponse("There was an error submitting contact form.", {
      status: 500,
    });
  }
}
