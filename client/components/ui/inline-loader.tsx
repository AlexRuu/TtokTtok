"use client";

import { motion } from "framer-motion";

interface InlineLoaderProps {
  color?: string;
  size?: number;
}

const InlineLoader = ({ color = "#6B4C3B", size = 5 }: InlineLoaderProps) => {
  const STAGGER = 0.15;
  const DURATION = 0.8;

  return (
    <span className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: DURATION,
            delay: i * STAGGER,
            ease: "easeInOut",
          }}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
};

export default InlineLoader;
