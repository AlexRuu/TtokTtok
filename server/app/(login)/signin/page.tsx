import { Metadata } from "next";
import SignInForm from "./components/signin-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | TtokTtok Admin",
  description: "Sign in to your TtokTtok admin account",
};

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "ADMIN") {
    redirect("/");
  }

  return (
    <div className="h-full">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
