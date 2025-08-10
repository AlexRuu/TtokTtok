"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UnauthorizedDisplay = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9F5] text-[#6B4C3B] px-4">
      <div className="max-w-md text-center rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
        <p className="mb-6">
          Sorry, you do not have permission to access this page.
        </p>
        <button
          onClick={handleSignOut}
          className="bg-[#E6B8A2] text-white px-4 py-2 rounded-xl hover:bg-[#d49f8a] transition hover:cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedDisplay;
