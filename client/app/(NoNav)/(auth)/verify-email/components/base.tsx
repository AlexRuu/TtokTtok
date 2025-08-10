"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Verifying from "./verifying";
import Verified from "./verified";
import Invalid from "./invalid";
import useLoading from "@/hooks/use-loading";
import Loader from "@/components/ui/loader";
import postVeriifyEmail from "@/actions/post-verify-email";

const VerificationPage = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"verifying" | "verified" | "invalid">();
  const searchParams = useSearchParams();

  useEffect(() => {
    startLoading();
    const token = searchParams.get("token");
    if (!token) {
      setStatus("verifying");
      const pendingEmail = localStorage.getItem("pendingEmail");
      if (!pendingEmail) {
        setStatus("invalid");
        stopLoading();
        return;
      }
      setEmail(pendingEmail!);
      stopLoading();
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await postVeriifyEmail(token);
        if (res) {
          if (!res.ok) {
            stopLoading();
            setStatus("invalid");
          }
          stopLoading();
          setStatus("verified");
        }
      } catch {
        stopLoading();
        setStatus("invalid");
      }
    };

    verifyEmail();
    localStorage.removeItem("pendingEmail");
  }, [searchParams, startLoading, stopLoading]);

  if (isLoading) {
    <Loader />;
  }

  if (status == "verifying") return <Verifying email={email} />;
  if (status == "verified") return <Verified />;
  if (status == "invalid") return <Invalid />;
};

export default VerificationPage;
