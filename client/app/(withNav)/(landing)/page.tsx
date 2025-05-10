"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Pencil, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Floating 떡 */}
        <motion.div
          className="absolute top-10 left-10 w-12 h-12 opacity-20"
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

      {/* How it Works Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <BookOpen className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />
            ),
            title: "Learn",
            desc: "Explore easy-to-understand lessons on grammar, particles, and more.",
            bg: "#FFF1EA",
          },
          {
            icon: <Pencil className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />,
            title: "Practice",
            desc: "Reinforce what you’ve learned with quick quizzes and interactive questions.",
            bg: "#FFEEE4",
          },
          {
            icon: (
              <BarChart2 className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />
            ),
            title: "Track",
            desc: "Sign up when you’re ready to start tracking your progress and revisiting lessons.",
            bg: "#FFF6EF",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-md text-center transition-transform hover:scale-[1.02] hover:shadow-lg"
            style={{ backgroundColor: card.bg }}
          >
            {card.icon}
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </section>
      {/* Call to Action - Sign Up Section */}
      <section className="py-20 bg-[#FFE6D8] text-center rounded-b-xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-semibold text-[#6B4C3B] mb-4">
            Ready to start your Korean learning journey?
          </h2>
          <p className="text-lg text-[#6B4C3B]/80 mb-8">
            Sign up today and track your progress as you learn and grow!
          </p>
          <Link href="/signup">
            <Button className="hover:cursor-pointer w-full font-semibold bg-[#B75F45] hover:bg-[#D69E78] text-white py-4 sm:py-5 text-base sm:text-md rounded-xl transition-all shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
              Sign Up Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
