"use client";
import { motion } from "framer-motion";

const SummaryComponent = () => {
  return (
    <section className="max-w-4xl mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h1 className="text-4xl font-bold text-center mb-5">
          About <span className="text-[#B75F45]">Ttok</span>
          <span className="text-[#D69E78]">Ttok</span>
          <sup className="text-base text-[#B75F45] ml-1 -translate-y-[0.9rem] inline-block">
            똑똑
          </sup>
        </h1>
      </motion.div>

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <p className="text-lg py-3">
          TtokTtok (똑똑) began as a personal journey to explore and learn the
          Korean language. It&apos;s designed to help you build a strong
          foundation through bite-sized lessons and interactive quizzes. The
          name is a playful blend of the Korean word for “smart” (똑똑하다) and
          “rice cake” (떡). Come have a taste — let&apos;s grow smarter
          together!
        </p>
        <p className="text-lg py-3">
          If you&apos;ve ever felt like learning a new language is out of reach,
          trust me — I&apos;ve been there. Take a look at my journey below, and
          know that if I can do it, so can you. We&apos;re in this together!
        </p>
      </motion.div>
    </section>
  );
};

export default SummaryComponent;
