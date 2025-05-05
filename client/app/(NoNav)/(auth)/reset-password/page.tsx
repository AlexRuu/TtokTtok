import React from "react";
import ResetPasswordBasePage from "./components/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | TtokTtok",
  description: "Reset your password",
};

const ResetPasswordPage = () => {
  return <ResetPasswordBasePage />;
};
export default ResetPasswordPage;
