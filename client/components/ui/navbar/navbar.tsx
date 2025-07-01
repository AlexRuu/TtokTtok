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

  const pathName = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (!navRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setNavHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(navRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [drawerRef]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  if (!mounted) {
    return <Loader />;
  }
  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-[#FAF3F0]/70 backdrop-blur-md shadow-md border-b border-[#f0e1da]"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded"
          >
            {/* Logo */}
            <div className="relative w-12 h-12 min-h-[48px]">
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
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B4C3B]">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "transition-all duration-200 px-2 py-1 rounded-md hover:text-[#A65A3A] hover:bg-[#FFF3EC]",
                  pathName === link.path &&
                    "text-[#A65A3A] font-medium underline underline-offset-4 decoration-[#D69E78]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-5">
              <SearchBar />
              {status == "authenticated" ? (
                <AuthDropdown />
              ) : (
                <Link
                  href="/signin"
                  className="ml-2 px-4 py-1.5 text-sm rounded-full bg-[#FFEFE7] hover:bg-[#f5dbcf] text-[#6B4C3B] transition font-medium shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#6B4C3B] focus-visible:ring-2 focus-visible:ring-[#A65A3A] focus-visible:ring-offset-2] hover:cursor-pointer"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu with Framer Motion */}
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
