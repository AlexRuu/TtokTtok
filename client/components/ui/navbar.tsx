"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  const links = useMemo(
    () => [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Lessons",
        path: "/lessons",
      },
      {
        name: "Quizzes",
        path: "/quizzes",
      },
      {
        name: "About",
        path: "/about",
      },
    ],
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#FAF3F0]/80 backdrop-blur-xs px-4 py-3 shadow-sm md:px-8">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded"
          >
            {/* Logo */}
            <div className="relative w-12 h-12">
              <Image
                src="/tteok.png"
                alt="Ttok Logo"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>

            {/* Title with superscripted 똑똑 */}
            <div className="flex items-baseline space-x-1 leading-none">
              {/* Main text */}
              <span className="text-[1.75rem] font-semibold tracking-tight">
                <span className="text-[#B75F45]">Ttok</span>
                <span className="text-[#D69E78]">Ttok</span>
              </span>
              {/* Superscript subtitle */}
              <span className="text-xs text-[#B75F45] translate-y-[-0.9rem]">
                똑똑
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-light text-[#6B4C3B]">
            {links.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                aria-current={pathName === link.path ? "page" : undefined}
                className={cn(
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded px-2 py-1 hover:text-[#A65A3A] transition-colors border-b-2 border-transparent focus-visible:text-[#A65A3A]",
                  pathName === link.path
                    ? "border-[#A65A3A] text-[#A65A3A] font-medium"
                    : ""
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/auth/signin"
              aria-label="Login"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] ml-4 px-3 py-1 rounded-full bg-[#FFEFE7] hover:bg-[#f5dbcf] transition text-[#6B4C3B] font-medium"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#6B4C3B] focus-visible:ring-2 focus-visible:ring-[#A65A3A] focus-visible:ring-offset-2]"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu with Framer Motion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="drawer"
            ref={drawerRef}
            className="md:hidden overflow-hidden bg-[#FAF3F0] shadow-md"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-2 p-3 pt-0">
              {links.map((link) => (
                <Link
                  href={link.path}
                  key={link.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={pathName === link.path ? "page" : undefined}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A65A3A] block px-4 py-3 text-base rounded-md hover:bg-[#FBEDE7] transition-colors"
                >
                  <span
                    className={cn(
                      "inline-block border-b-2 border-transparent transition-colors",
                      pathName === link.path
                        ? "border-[#A65A3A] text-[#A65A3A] font-medium"
                        : "hover:border-[#E0B9AA]"
                    )}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Full-width Login CTA */}
            <div className="p-3 border-t border-[#EADCD5]">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 font-medium text-[#6B4C3B] bg-[#FFEFE7] hover:bg-[#F5DBCF] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A65A3A]"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
