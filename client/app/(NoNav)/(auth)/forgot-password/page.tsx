import React from "react";
import ForgotPasswordForm from "./components/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | TtokTtok",
  description: "Forgot Password",
};

const ForgotPasswordPage = () => {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
