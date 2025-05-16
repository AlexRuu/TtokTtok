import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import React from "react";

interface SubmittedContactProps {
  setSubmitted: (value: boolean) => void;
}

const SubmittedContact: React.FC<SubmittedContactProps> = ({
  setSubmitted,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-start space-y-10 text-center px-6 pt-24 pb-16">
      <div className="space-y-5 max-w-xl flex flex-col items-center">
        <CircleCheck className="w-14 h-14" color="#7c86ff" strokeWidth={1.5} />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#6B4C3B]">
          감사합니다!
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[#6B4C3B]">
          Thank you for your message. We&apos;ll get back to you as soon as
          possible.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <Button
          onClick={() => setSubmitted(false)}
          className="hover:cursor-pointer w-full font-semibold bg-[#D8D3FF] hover:bg-[#C7C1FF] text-[#3E3364] py-4 text-base sm:text-md rounded-xl shadow-sm hover:scale-[1.01] hover:shadow-md transition duration-200 ease-in-out focus:ring-2 focus:ring-[#B6A8FF] focus:outline-none"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default SubmittedContact;
