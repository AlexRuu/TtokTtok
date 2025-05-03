import { Metadata } from "next";
import SignUpForm from "./components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | TtokTtok",
  description: "Create a free Ttok Ttok account",
};

const SignUpPage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
