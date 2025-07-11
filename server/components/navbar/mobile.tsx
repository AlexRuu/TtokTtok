import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  links: { name: string; path: string }[];
  navHeight: number;
}

const MobileNav = ({ isOpen, setIsOpen, links, navHeight }: MobileNavProps) => {
  const pathName = usePathname();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="drawer"
          className="fixed left-0 right-0 z-30 md:hidden bg-[#FAF3F0] shadow-md"
          style={{ top: `${navHeight || 64}px` }}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="space-y-2 p-3 pt-0">
            <Link
              href={"/"}
              onClick={() => setIsOpen(false)}
              aria-current={pathName === "/" ? "page" : undefined}
              className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#A65A3A] block px-4 py-3 text-base rounded-md hover:bg-[#FBEDE7] transition-colors"
            >
              <span
                className={cn(
                  "inline-block border-b-2 border-transparent transition-colors",
                  pathName === "/"
                    ? "border-[#A65A3A] text-[#A65A3A] font-medium"
                    : "hover:border-[#E0B9AA]"
                )}
              >
                Home
              </span>
            </Link>
            {links.map((link) => (
              <Link
                href={link.path}
                key={link.path}
                onClick={() => setIsOpen(false)}
                aria-current={pathName === link.path ? "page" : undefined}
                className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#A65A3A] block px-4 py-3 text-base rounded-md hover:bg-[#FBEDE7] transition-colors"
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
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-3 font-medium text-red-400 rounded-md hover:bg-[#FBEDE7] transition-colors hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
