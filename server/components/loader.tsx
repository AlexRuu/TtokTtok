"use client";

import { motion } from "framer-motion";

const Loader = () => {
  const dots = ["로", "딩", ".", ".", "."];

  return (
    <div className="fixed inset-0 bg-white backdrop-blur-xs backdrop-opacity-50 z-50 flex justify-center items-center opacity-80">
      <div className="p-4 rounded-lg flex space-x-2 text-4xl font-bold text-[#2D3A45]">
        {dots.map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 0, opacity: 0.3 }}
            animate={{ y: [-4, 4, -4], opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
