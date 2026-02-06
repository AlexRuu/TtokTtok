"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  mode: "review" | "study";
  onChange: (mode: "review" | "study") => void;
}

const VocabModeToggle = ({ mode, onChange }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ width: number; left: number }>({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = Array.from(containerRef.current.querySelectorAll("button"));
    const activeBtn = buttons.find(
      (btn) => btn.textContent?.toLowerCase() === mode,
    ) as HTMLButtonElement;
    if (activeBtn) {
      setPillStyle({
        width: activeBtn.offsetWidth,
        left: activeBtn.offsetLeft,
      });
    }
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="relative flex rounded-full bg-white border border-[#F2E6DF] p-1 w-fit mx-auto my-5 shadow-sm select-none"
    >
      {/* Animated sliding pill */}
      <motion.div
        className="absolute top-1 bottom-1 bg-[#FFF1E8] rounded-full shadow-inner"
        animate={{ left: pillStyle.left, width: pillStyle.width }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />

      {(["review", "study"] as const).map((m) => {
        const isActive = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="relative z-10 px-5 py-2 text-sm font-medium rounded-full flex justify-center items-center hover:cursor-pointer"
          >
            <span
              className={`transition-colors ${
                isActive
                  ? "text-[#6B4C3B]"
                  : "text-[#9A7B6A] hover:text-[#6B4C3B]"
              }`}
            >
              {m === "review" ? "Review" : "Study"}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default VocabModeToggle;
