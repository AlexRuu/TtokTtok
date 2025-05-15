import prismadb from "@/lib/prismadb";
import { contactFormSchema } from "@/schemas/form-schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    await prismadb.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Contact form error:", error);
    return new NextResponse("There was an error submitting contact form.", {
      status: 500,
    });
  }
}
