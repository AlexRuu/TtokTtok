"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function BottomLogo() {
  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <motion.div
        className="mx-auto w-full max-w-[200px] opacity-65"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        viewport={{ once: true }}
      >
        <Image
          src="/tteok.png"
          alt="TtokTtok Logo"
          width={400}
          height={200}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>
    </section>
  );
}

export default BottomLogo;
