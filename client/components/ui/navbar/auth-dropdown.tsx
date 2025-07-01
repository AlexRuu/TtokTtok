"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleUserRound, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import ProfileAvatar from "../tteok-avatar";

const AuthDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [arrowLeft, setArrowLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const frame = requestAnimationFrame(() => {
      if (!triggerRef.current || !contentRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const left = triggerRect.left + triggerRect.width / 2 - contentRect.left;
      setArrowLeft(left);
    });

    const handleResize = () => {
      if (!triggerRef.current || !contentRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const left = triggerRect.left + triggerRect.width / 2 - contentRect.left;
      setArrowLeft(left);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [dropdownOpen]);

  const handleLogout = useCallback(() => {
    signOut({ redirect: false });
  }, []);

  // Hover handlers with delay to prevent flicker
  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // tweak delay if needed
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <div
            ref={triggerRef}
            aria-label="User menu"
            tabIndex={0}
            className="hover:ring-2 hover:ring-[#f0d2c1] rounded-full p-1 transition cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDropdownOpen((prev) => !prev);
              }
            }}
          >
            <CircleUserRound />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={contentRef}
          onCloseAutoFocus={(e) => e.preventDefault()}
          side="bottom"
          align="center"
          sideOffset={10}
          className="hidden md:block relative min-w-28 px-3 pb-3 pt-1 bg-[#FBEDE7]/80 backdrop-blur-md border border-[#e8dcd5] shadow-sm rounded-xl overflow-visible"
        >
          {arrowLeft !== null && (
            <div
              className="absolute -top-1.5 w-3 h-3 bg-[#e7dad5d8] rotate-45 border border-[#e8dcd5] z-50 -translate-x-1/2"
              style={{ left: arrowLeft - 1 }}
            />
          )}
          <Link
            href="/profile"
            className="flex items-center mt-2 py-2 px-4 text-sm text-[#6B4C3B] hover:bg-[#f2dfd7] rounded-md text-center"
          >
            <ProfileAvatar
              color="#6B4C3B"
              size={30}
              className="mr-1 text-red-400 rounded p-1"
            />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="py-2 px-4 text-sm text-red-400 hover:bg-[#f2dfd7] rounded-md text-center w-full flex items-center"
          >
            <LogOut size={30} className="mr-1 text-red-400 rounded p-1" />
            Logout
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthDropdown;
