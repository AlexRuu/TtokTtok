"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import { useSession } from "next-auth/react";
import SearchBar from "./searchBar";
import MobileNav from "./mobile";
import Loader from "../loader";
import AuthDropdown from "./auth-dropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  const { data: session, status } = useSession();
  const pathName = usePathname();
  const isQuizRoute = pathName.startsWith("/quizzes/");
  const href = isQuizRoute
    ? `/signin?redirect=${encodeURIComponent(pathName)}`
    : "/signin";

  const navRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Measure nav height for mobile nav offset
  useEffect(() => {
    if (!navRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect) {
        setNavHeight(entry.contentRect.height);
      }
    });

    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle click outside to close mobile drawer
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Units", path: "/units" },
      { name: "Quizzes", path: "/quizzes" },
      { name: "Vocabulary", path: "/vocabulary" },
      { name: "Tags", path: "/tags" },
    ],
    [],
  );

  if (!mounted) return <Loader />;

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="sticky top-0 z-50 bg-[#FAF3F0]/70 backdrop-blur-md border-b border-[#f0e1da] shadow-md"
      >
        <div className="w-full max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          {/* Logo + Title */}
          <Link
            href="/"
            className="flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded"
          >
            <div className="relative w-12 h-12 min-h-12 transition-transform duration-200 hover:scale-[1.03]">
              <Image
                src="/tteok.png"
                alt="Ttok Logo"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>

            <div className="flex items-baseline space-x-1 leading-none">
              <span className="text-[1.75rem] font-semibold tracking-tight">
                <span className="text-[#B75F45]">Ttok</span>
                <span className="text-[#D69E78]">Ttok</span>
              </span>
              <span className="text-xs text-[#B75F45] translate-y-[-0.85rem]">
                똑똑
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-10 text-base lg:text-[1rem] font-medium text-[#6B4C3B]">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "text-[0.9rem] sm:text-[0.95rem] lg:text-[1rem] font-normal tracking-normal px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-all duration-200",
                  "hover:text-[#A65A3A] hover:bg-[#FFF3EC]",
                  pathName === link.path &&
                    "text-[#A65A3A] underline underline-offset-4 decoration-[#D69E78]",
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-5">
              <SearchBar />
              {status === "authenticated" ? (
                <AuthDropdown />
              ) : (
                <Link
                  href={href}
                  className="ml-2 px-5 py-2 text-base rounded-full bg-[#FFEFE7] hover:bg-[#f5dbcf] text-[#6B4C3B] transition font-medium shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="p-2 md:hidden text-[#6B4C3B] focus-visible:ring-2 focus-visible:ring-[#A65A3A] focus-visible:ring-offset-2"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={links}
        session={session}
        status={status}
        navHeight={navHeight}
      />
    </>
  );
}
