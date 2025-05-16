"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CallToActionComponentProps {
  fadeInUp: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

const CallToActionComponent: React.FC<CallToActionComponentProps> = ({
  fadeInUp,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  return (
    <section className="py-20 bg-[#FFE6D8] text-center rounded-b-xl">
      {status === "authenticated" ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-semibold text-[#6B4C3B] mb-4">
            Ready for another lesson?
          </h2>
          <p className="text-lg text-[#6B4C3B]/80 mb-8">
            Let&apos;s learn something new today!
          </p>
          <Link href="/lessons">
            <Button className="hover:cursor-pointer w-full font-semibold bg-[#B75F45] hover:bg-[#D69E78] text-white py-4 sm:py-5 text-base sm:text-md rounded-xl transition-all shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
              Go To Lessons
            </Button>
          </Link>
        </motion.div>
      ) : (
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
          <Link href="/signin">
            <Button className="hover:cursor-pointer w-full font-semibold bg-[#B75F45] hover:bg-[#D69E78] text-white py-4 sm:py-5 text-base sm:text-md rounded-xl transition-all shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
              Let&apos;s Get Started
            </Button>
          </Link>
        </motion.div>
      )}
    </section>
  );
};

export default CallToActionComponent;
