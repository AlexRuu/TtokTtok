"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import SearchBar from "./searchBar";
import { useEffect } from "react";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  links: { name: string; path: string }[];
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  navHeight: number;
}

const MobileNav = ({
  isOpen,
  setIsOpen,
  links,
  status,
  navHeight,
}: MobileNavProps) => {
  const pathName = usePathname();

  const handleLogout = () => {
    signOut({ redirect: false });
  };

  const handleLinkClick = (callback?: () => void) => {
    setTimeout(() => {
      setIsOpen(false);
      callback?.();
    }, 100);
  };

  const lockScroll = () => {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  };

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {/* Optional Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            key="drawer"
            role="dialog"
            aria-label="Mobile navigation menu"
            aria-modal="true"
            className="fixed left-0 right-0 z-30 md:hidden bg-[#FAF3F0] shadow-md"
            style={{ top: `${navHeight || 64}px` }}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <SearchBar variant="mobile" />

            <div className="space-y-2 p-3 pt-0">
              {links.map((link, index) => (
                <Link
                  href={link.path}
                  key={link.path}
                  onClick={() => handleLinkClick()}
                  aria-current={pathName === link.path ? "page" : undefined}
                  autoFocus={index === 0}
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

              <div className="border-t border-[#EADCD5] my-2" />

              {status === "authenticated" ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => handleLinkClick()}
                    className="block w-full text-left px-4 py-3 rounded-md hover:bg-[#FBEDE7] transition-colors hover:cursor-pointer"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => handleLinkClick(handleLogout)}
                    className="block w-full text-left px-4 py-3 font-medium text-red-400 rounded-md hover:bg-[#FBEDE7] transition-colors hover:cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => handleLinkClick()}
                  className="block w-full text-center px-4 py-3 font-medium text-[#6B4C3B] bg-[#FFEFE7] hover:bg-[#F5DBCF] rounded-md hover:cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A65A3A]"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
