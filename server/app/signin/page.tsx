import { Metadata } from "next";
import SignInForm from "./components/signin-form";

export const metadata: Metadata = {
  title: "Login | TtokTtok Admin",
  description: "Sign in to your Ttok Ttok admin account",
};

const SignInPage = () => {
  return (
    <div className="h-full">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
