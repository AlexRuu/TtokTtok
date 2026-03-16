"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Loader = () => {
  const characters = ["로", "딩", "중", ".", ".", "."];

  const DURATION = 1.4;
  const STAGGER = 0.18;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF9F5]/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Tteok image — gentle bob */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/tteok.png"
            alt="Loading"
            width={120}
            height={120}
            className="select-none"
            priority
          />
        </motion.div>

        {/* Korean characters + dots as one continuous wave */}
        <div className="flex items-end gap-2">
          {characters.map((char, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: DURATION,
                delay: i * STAGGER,
                ease: "easeInOut",
              }}
              className="text-2xl font-bold tracking-wide text-[#6B4C3B] select-none"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Breathing underline — synced to kick off after the last dot */}
        <motion.div
          animate={{
            width: ["1.5rem", "3.5rem", "1.5rem"],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
            delay: (characters.length - 1) * STAGGER,
          }}
          className="h-1 rounded-full bg-[#FFB899]"
        />
      </div>
    </div>
  );
};

export default Loader;
