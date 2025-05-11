"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroComponentProps {
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

const HeroComponent: React.FC<HeroComponentProps> = ({ fadeInUp }) => {
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      {/* Floating 떡 */}
      <motion.div
        className="absolute top-10 right-10 w-12 h-12 opacity-30"
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        <Image src="/tteok.png" alt="떡" fill className="object-contain" />
      </motion.div>
      <motion.div
        className="absolute top-10 left-10 w-12 h-12 opacity-30"
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        <Image src="/tteok.png" alt="떡" fill className="object-contain" />
      </motion.div>
      {/* Logo & Title */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex flex-col items-center space-x-4"
      >
        <motion.div
          variants={fadeInUp}
          className="relative w-40 h-40 sm:w-48 sm:h-48"
        >
          <Image
            src="/tteok.png"
            alt="Tteok Logo"
            fill
            className="object-contain"
          />
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-5xl font-bold tracking-tight mt-[-1.5rem]"
        >
          <span className="text-[#B75F45]">Ttok</span>
          <span className="text-[#D69E78]">Ttok</span>
          <sup className="text-base text-[#B75F45] ml-1 -translate-y-[0.9rem] inline-block">
            똑똑
          </sup>
        </motion.h1>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="mt-6 max-w-xl text-lg font-medium text-[#6B4C3B]/90"
      >
        Learn Korean with bite-sized lessons and quizzes.
      </motion.p>
      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
        className="mt-2 max-w-xl text-lg font-medium text-[#6B4C3B]/90"
      >
        Made for learners by a learner!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8"
      >
        <Link href="/lessons">
          <Button className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-all shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
            Start Learning
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroComponent;
