import prismadb from "@/lib/prismadb";
import { hash } from "argon2";
import { nanoid } from "nanoid";
import { addMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/verificationEmail";
import { signUpFormSchema } from "@/schemas/form-schemas";

export async function POST(req: Request) {
  try {
    // Retrieve data and deconstruct it
    const body = await req.json();
    const parsed = signUpFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }
    const { firstName, lastName, email, password, confirmPassword } =
      parsed.data;

    // Check for user data
    if (!body) {
      return new NextResponse("Please provide user data", { status: 401 });
    }

    // Check for existing user
    const existingUser = await prismadb.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse("Email in use", { status: 400 });
    }

    // Check to see if the passwords match in the user submitted data
    if (password !== confirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    // Hash the password provided
    const hashedPassword = await hash(password);

    // Create the user in the database
    const user = await prismadb.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });

    // Create an email verification token to be used
    const emailVerificationToken = nanoid(32);

    // Create a verification token in the database
    await prismadb.verificationToken.create({
      data: {
        identifier: user.email,
        token: emailVerificationToken,
        userId: user.id,
        expires: addMinutes(new Date(), 10),
      },
    });

    // Send the user an email to verify their account
    await sendVerificationEmail(email, emailVerificationToken);

    // Return user data and end of api
    return new NextResponse("User created, pending verification", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error creating user", { status: 501 });
  }
}
