"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CircleUserRound, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "./searchBar";
import MobileNav from "./mobile";
import Loader from "../loader";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleLogout = () => {
    signOut({ redirect: false });
  };

  if (!mounted) {
    return <Loader />;
  }
  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-40 bg-[#FAF3F0]/80 backdrop-blur-xs px-4 py-3 shadow-sm md:px-8"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
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
            <SearchBar />
            {status == "authenticated" ? (
              <div className="relative hidden md:block group">
                {/* Trigger Button */}
                <button
                  className="py-2 px-4 text-sm focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <CircleUserRound />
                </button>

                {/* Spacer that is hoverable (bridge) */}
                <div className="absolute top-full left-0 w-full h-4 z-40" />

                {/* Dropdown */}
                <div className="min-w-28 absolute top-full mt-4 right-0 -translate-x-1.5 w-20 sm:w-28 bg-[#FBEDE7]/80 backdrop-blur-md border border-[#e8dcd5] shadow-sm rounded-xl transform transition-all duration-200 ease-out opacity-0 -translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible z-50">
                  <div className="absolute top-[-6px] right-[1.1rem] w-3 h-3 bg-[#e7dad5d8] rotate-45 border border-[#e8dcd5] z-60" />
                  <div className="flex flex-col py-1">
                    <Link
                      href="/profile"
                      className="block py-2 px-4 text-sm text-[#6B4C3B] hover:bg-[#f2dfd7] rounded-md text-center"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 px-4 text-sm text-[#6B4C3B] hover:bg-[#f2dfd7] rounded-md text-center w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                aria-label="Login"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] ml-4 px-3 py-1 rounded-full bg-[#FFEFE7] hover:bg-[#f5dbcf] transition text-[#6B4C3B] font-medium"
              >
                Login
              </Link>
            )}
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
