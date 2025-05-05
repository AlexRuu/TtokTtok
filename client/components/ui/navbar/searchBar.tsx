"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "../input";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
}

const SearchBar = ({ variant = "desktop" }: SearchBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(variant === "mobile");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isSearchOpen && variant === "desktop") {
      inputRef.current?.focus();
    }

    if (variant === "desktop") {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(target)
        ) {
          setIsSearchOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsSearchOpen(false);
        }
      };

      let timeoutId: NodeJS.Timeout;
      if (isSearchOpen) {
        timeoutId = setTimeout(() => {
          document.addEventListener("mousedown", handleClickOutside);
          document.addEventListener("keydown", handleKeyDown);
        }, 0);
      }

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSearchOpen, variant]);

  return (
    <>
      {variant === "mobile" ? (
        <div className="pt-4 pb-2 px-6">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search lessons or units..."
              className="w-full pl-10 pr-4 text-[#6B4C3B] placeholder:text-[#B59E90] bg-white border border-[#EADCD5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A65A3A]"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B59E90] pointer-events-none"
              size={18}
            />
          </div>
        </div>
      ) : (
        <>
          <button
            aria-label="Toggle search"
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchOpen((prev) => !prev);
            }}
            className="text-[#6B4C3B] hover:text-[#A65A3A] transition hover:cursor-pointer"
          >
            <Search size={20} />
          </button>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                ref={containerRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute top-full left-0 w-full bg-[#FFF6F2] border-t border-[#EADCD5] shadow-md z-50"
              >
                <div className="max-w-6xl mx-auto px-4 py-3">
                  <div className="relative">
                    <Input
                      type="text"
                      ref={inputRef}
                      placeholder="Search lessons or units..."
                      className="w-full pl-10 pr-4 text-[#6B4C3B] placeholder:text-[#B59E90] focus:outline-none focus:ring-0" // Reduced padding-right to ensure no overlap with the input
                    />
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B59E90] pointer-events-none" // Adjusted left positioning to avoid placeholder overlap
                      size={18}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default SearchBar;
