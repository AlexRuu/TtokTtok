"use client";

import { useEffect, useState } from "react";
import PasswordResetSuccess from "./success";
import FailedPasswordReset from "./fail";
import PendingPasswordResetPage from "./pending";
import { useSearchParams } from "next/navigation";

const ResetPasswordBasePage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | "pending">();
  const [passToken, setPassToken] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const validToken = async () => {
      try {
        if (!token) {
          setStatus("failed");
          return;
        }
        setPassToken(token);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/reset-password?token=${token}`
        );
        if (!res.ok) {
          setStatus("failed");
          return;
        }
        setStatus("pending");
      } catch {
        setStatus("failed");
        return;
      }
    };
    validToken();
  }, [searchParams]);

  if (status === "success") return <PasswordResetSuccess />;
  if (status === "failed") return <FailedPasswordReset />;
  if (status === "pending")
    return <PendingPasswordResetPage setStatus={setStatus} token={passToken} />;
};

export default ResetPasswordBasePage;
