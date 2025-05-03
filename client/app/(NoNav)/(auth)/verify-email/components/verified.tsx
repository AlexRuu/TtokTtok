"use client";

import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Verified = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("pendingEmail");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6 px-4">
      <div className="space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-8 border border-pink-100 bg-white shadow-sm rounded-2xl">
        <MailCheck size={50} className="mx-auto" color="#7c86ff" />
        <h1 className="text-center text-2xl font-semibold">Email Confirmed</h1>
        <p className="text-center text-lg">
          Thank you for confirming your email.
        </p>
        <p className="text-center">You&apos;re all set to go!</p>
        <p className="text-center">Click the button below to login.</p>
        <Button
          className="flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md bg-indigo-200 hover:bg-indigo-300 text-black w-full font-semibold rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
          onClick={() => router.push("/signin")}
        >
          Go Login
        </Button>
      </div>
    </div>
  );
};

export default Verified;
