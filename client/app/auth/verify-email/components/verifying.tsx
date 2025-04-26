"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

interface VerifyingProps {
  email: string;
}

const Verifying: React.FC<VerifyingProps> = ({ email }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const resendEmail = async () => {
    startLoading();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      if (!res.ok) {
        const resError = await res.text();
        toast.error(
          resError || "There was an error resending the confirmation email",
          {
            style: {
              background: "#ffeef0",
              color: "#943c5e",
              borderRadius: "10px",
              padding: "12px 18px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
              fontSize: "16px",
            },
            className:
              "transition-all transform duration-300 ease-in-out font-medium",
          }
        );
        stopLoading();
        return;
      }
      toast.success("Another confirmation email has been sent", {
        style: {
          background: "#e8f5e9",
          color: "#388e3c",
          borderRadius: "10px",
          padding: "12px 18px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
          fontSize: "16px",
        },
        className:
          "transition-all transform duration-300 ease-in-out font-medium",
      });
      stopLoading();
    } catch {
      toast.error("There was an error resending the confirmation email", {
        style: {
          background: "#ffeef0",
          color: "#943c5e",
          borderRadius: "10px",
          padding: "12px 18px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
          fontSize: "16px",
        },
        className:
          "transition-all transform duration-300 ease-in-out font-medium",
      });
      stopLoading();
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6 px-4">
      {isLoading && <Loader />}
      <div className="space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-8 border border-pink-100 bg-white shadow-sm rounded-2xl">
        <Mail size={50} className="mx-auto" />
        <h1 className="text-center text-2xl font-semibold">Confirm Email</h1>
        <p className="text-center text-lg">Thank you for signing up!</p>
        <p className="text-center">
          We have sent an email to <b>{email}</b>. Please check your inbox and
          follow the instructions provided to confirm your email.
        </p>
        <p className="text-center">
          If you don&apos;t see it in your inbox, please check your junk or spam
          folder or click the resend button below!
        </p>
        <Button
          onClick={() => {
            resendEmail();
          }}
          className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
        >
          Resend Confirmation Email
        </Button>
      </div>
    </div>
  );
};

export default Verifying;
