import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

interface QuizCooldownProps {
  remainingSeconds: number;
  onStartNewQuiz: () => void;
}

export const QuizCooldown = ({
  remainingSeconds,
  onStartNewQuiz,
}: QuizCooldownProps) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      const timer = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setTimeout(() => setReady(true), 300);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const digits = [...minutes, ":", ...seconds];

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto bg-[#FFF8F3] text-[#6B4C3B] mt-10 rounded-2xl shadow-sm border border-[#FFE4D2]/60 overflow-hidden">
      <div className="flex flex-col items-center justify-between text-center gap-6 sm:gap-8 min-h-[600px]">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-[#6B4C3B]">
            {ready
              ? "Your next quiz is ready!"
              : "Your next quiz is on its way!"}
          </h2>
          <p className="text-[#A67856] text-sm sm:text-base">
            {ready
              ? "Take a deep breath — let’s go!"
              : "Time until your next quiz arrives"}
          </p>
        </div>

        <motion.div
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:gap-6"
        >
          <motion.div
            animate={{
              opacity: ready ? 0.25 : 1,
              scale: ready ? 0.9 : 1,
              y: ready ? -4 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex space-x-2 h-[60px] sm:h-[70px]"
          >
            {digits.map((digit, idx) =>
              digit === ":" ? (
                <div
                  key={idx}
                  className="text-4xl sm:text-4xl font-bold text-[#6B4C3B] w-8 flex items-center justify-center"
                >
                  :
                </div>
              ) : (
                <div
                  key={idx}
                  className="bg-white w-10 sm:w-14 rounded-xl border border-[#FFD1B8] shadow-[0_3px_6px_rgba(0,0,0,0.04)] flex items-center justify-center text-3xl sm:text-4xl font-bold text-[#6B4C3B]"
                >
                  {digit}
                </div>
              )
            )}
          </motion.div>

          <motion.div
            animate={{
              opacity: ready ? 1 : 0.95,
              y: ready ? -6 : 0,
              scale: ready ? 1.03 : 1,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Image
              src="/not-found.png"
              alt="Waiting Tteok"
              width={340}
              height={340}
              className="rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] bg-[#FFFDFB] max-w-[80vw] sm:max-w-[340px]"
            />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              opacity: ready ? 1 : 0,
              y: ready ? 0 : 12,
              pointerEvents: ready ? "auto" : "none",
            }}
            transition={{
              delay: ready ? 0.3 : 0,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <Button
              onClick={onStartNewQuiz}
              className="bg-[#FFE4C7] hover:bg-[#FFD8A8] text-[#6B4C3B] rounded-3xl px-8 py-3 font-medium shadow-sm transition-colors duration-200 hover:cursor-pointer mt-2 sm:mt-4"
              aria-label="Start new quiz"
            >
              Start new quiz
            </Button>
          </motion.div>
        </motion.div>

        <div className="w-40 h-1 rounded-full bg-[#FFEBDD] mb-4 sm:mb-0" />
      </div>
    </div>
  );
};
