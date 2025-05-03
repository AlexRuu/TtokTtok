import React from "react";
import VerificationPage from "./components/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Email | TtokTtok",
  description: "Confirm your email",
};

const VerifyPage = () => {
  return (
    <div>
      <VerificationPage />
    </div>
  );
};

export default VerifyPage;
