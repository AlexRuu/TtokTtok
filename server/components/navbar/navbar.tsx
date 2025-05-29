"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MobileNav from "./mobile";
import Loader from "../loader";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathName = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
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
        name: "Users",
        path: "/users",
      },
    ],
    []
  );
  const dropdownLinks = useMemo(
    () => [
      { name: "Units", path: "/units" },
      {
        name: "Lessons",
        path: "/lessons",
      },
      {
        name: "Quizzes",
        path: "/quizzes",
      },
      { name: "Tags", path: "/tags" },
      { name: "Vocabulary", path: "/vocabulary" },
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

  if (!mounted) {
    return <Loader />;
  }
  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-40 bg-[#FAF3F0]/80 backdrop-blur-xs px-4 py-3 shadow-xs md:px-8"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded"
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
                key={link.name}
                href={link.path}
                aria-current={pathName === link.path ? "page" : undefined}
                className={cn(
                  "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded px-2 py-1 hover:text-[#A65A3A] transition-colors border-b-2 border-transparent focus-visible:text-[#A65A3A]",
                  pathName === link.path
                    ? "border-[#A65A3A] text-[#A65A3A] font-medium"
                    : ""
                )}
              >
                {link.name}
              </Link>
            ))}
            <DropdownMenu
              open={dropdownOpen}
              onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
              modal={false}
            >
              <DropdownMenuTrigger>
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="hover:cursor-pointer"
                >
                  Teaching
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onMouseLeave={() => setDropdownOpen(false)}
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                }}
                className="min-w-28 overflow-visible relative flex flex-col px-3 pb-3 pt-1 top-3 bg-[#FBEDE7]/80 backdrop-blur-md border border-[#e8dcd5] shadow-sm rounded-xl"
              >
                <div className="absolute top-[-6px] right-3/7 w-3 h-3 bg-[#e7dad5d8] rotate-45 border border-[#e8dcd5] z-60" />
                {dropdownLinks.map((link) => (
                  <Link
                    href={link.path}
                    key={link.name}
                    aria-current={pathName === link.path ? "page" : undefined}
                    className={cn(
                      "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded px-2 py-1 hover:text-[#A65A3A] transition-colors border-b-2 border-transparent focus-visible:text-[#A65A3A]",
                      pathName === link.path ? "text-[#A65A3A] font-bold" : ""
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              className="hover:cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A65A3A] rounded px-2 py-1 hover:text-[#A65A3A] transition-colors border-b-2 border-transparent focus-visible:text-[#A65A3A]"
              onClick={() => signOut()}
            >
              Logout
            </Button>
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
        navHeight={navHeight}
      />
    </>
  );
}
