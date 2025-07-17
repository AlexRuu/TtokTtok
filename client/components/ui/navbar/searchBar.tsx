"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Book,
  BookOpen,
  Layers,
  PenTool,
  Search,
  Tag,
} from "lucide-react";
import { Input } from "../input";
import useLoading from "@/hooks/use-loading";
import { SearchResult } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollableResults from "./scrollable-results";
import getSearchResults from "@/actions/get-search-results";
interface SearchBarProps {
  variant?: "desktop" | "mobile";
}

const typeLabels: Record<SearchResult["type"], string> = {
  lesson: "Lessons",
  unit: "Units",
  quiz: "Quizzes",
  vocabulary: "Vocabulary",
  tag: "Tags",
};

const SearchBar = ({ variant = "desktop" }: SearchBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(variant === "mobile");
  const [query, setQuery] = useState("");
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { isLoading, startLoading, stopLoading } = useLoading();

  // Reset search bar when closed
  useEffect(() => {
    if (isSearchOpen === false) {
      setQuery("");
      setResults([]);
      setHighlightedIndex(-1);
    }
  }, [isSearchOpen]);

  // Reset highlight index for keyboard navigation
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results, query]);

  useEffect(() => {
    if (isSearchOpen && variant === "desktop") {
      inputRef.current?.focus();
    }
  }, [isSearchOpen, variant]);

  // Handle click-outside and keyboard events (only for desktop)
  useEffect(() => {
    if (variant !== "desktop") return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      } else if (e.key === "Enter") {
        e.preventDefault();

        const trimmedQuery = query.trim();

        if (highlightedIndex >= 0) {
          const selected = results[highlightedIndex];
          if (selected) {
            window.location.href = selected.href;
          }
        } else if (trimmedQuery.length > 0) {
          router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
          setIsSearchOpen(false);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedIndex, isSearchOpen, query, results, router, variant]);

  // Scroll to highlighted indexed item when navigating with keyboard
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    if (highlightedIndex >= results.length) {
      setHighlightedIndex(results.length - 1);
    }
  }, [highlightedIndex, results.length]);

  // Set search results
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      startLoading();

      getSearchResults(query)
        .then((data) => {
          setResults(data || []);
          setError(null);
        })
        .catch(() => {
          setError("Error fetching search results");
          setResults([]);
        })
        .finally(() => stopLoading());
    }, 300);

    return () => clearTimeout(delay);
  }, [query, startLoading, stopLoading]);

  // Render the results from search
  const renderResults = () => {
    if (isLoading) {
      return <p className="px-4 py-2 text-sm text-[#B59E90]">Loading...</p>;
    }

    if (error) {
      return <p className="px-4 py-2 text-sm text-red-500">{error}</p>;
    }

    if (results.length === 0 && query.length > 0) {
      return (
        <p className="px-4 py-2 text-sm text-[#B59E90]">No results found.</p>
      );
    }

    const grouped = results.reduce<
      Record<SearchResult["type"], SearchResult[]>
    >((acc, result) => {
      acc[result.type] = acc[result.type] || [];
      acc[result.type].push(result);
      return acc;
    }, {} as Record<SearchResult["type"], SearchResult[]>);

    const order: SearchResult["type"][] = [
      "lesson",
      "quiz",
      "vocabulary",
      "unit",
      "tag",
    ];

    let globalIndex = 0;

    return (
      <div className="space-y-3">
        {order.map((type) => {
          const items = grouped[type];
          if (!items || items.length === 0) return null;

          return (
            <div key={type}>
              <div className="px-4 pt-2 pb-1 text-xs font-semibold text-[#B59E90] uppercase tracking-wider">
                {typeLabels[type]}
              </div>
              <ul>
                {items.map((result) => {
                  const currentIndex = globalIndex++;

                  return (
                    <li
                      ref={(el) => {
                        itemRefs.current[currentIndex] = el;
                      }}
                      key={result.id}
                      className={`px-4 py-2 transition-colors duration-150 hover:bg-[#F9EDEB] cursor-pointer active:bg-[#F3D9D2] ${
                        currentIndex === highlightedIndex ? "bg-[#F9EDEB]" : ""
                      }`}
                      onMouseMove={() => {
                        if (highlightedIndex !== currentIndex) {
                          setHighlightedIndex(currentIndex);
                        }
                      }}
                    >
                      <Link
                        href={result.href}
                        className="flex items-start gap-3"
                      >
                        <div className="pt-1 text-[#B59E90]">
                          {result.type === "lesson" && <Book size={18} />}
                          {result.type === "unit" && <Layers size={18} />}
                          {result.type === "quiz" && <PenTool size={18} />}
                          {result.type === "vocabulary" && (
                            <BookOpen size={18} />
                          )}
                          {result.type === "tag" && <Tag size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-[#6B4C3B]">
                            {result.title}
                          </p>
                          <p className="text-sm text-[#B59E90]">
                            {result.subtitle}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  // Actual component render
  return (
    <>
      {variant === "mobile" ? (
        <div className="mt-12 pb-2 px-6">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : 0
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : results.length - 1
                  );
                } else if (e.key === "Enter" && highlightedIndex >= 0) {
                  e.preventDefault();
                  const selected = results[highlightedIndex];
                  if (selected) {
                    window.location.href = selected.href;
                  }
                } else if (e.key === "Escape") {
                  setIsSearchOpen(false);
                }
              }}
              placeholder="Search lessons or units..."
              className="w-full pl-10 pr-4 text-[#6B4C3B] placeholder:text-[#B59E90] bg-white border border-[#EADCD5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A65A3A]"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B59E90] pointer-events-none"
              size={18}
            />

            {query.trim().length > 0 && (
              <ScrollableResults className="absolute z-50 left-0 right-0 mt-3 rounded-md border border-[#EADCD5] bg-white shadow-sm divide-y divide-[#EADCD5]">
                {renderResults()}
              </ScrollableResults>
            )}
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
                className="absolute top-full left-0 w-full bg-[#FFF6F2] border-t border-[#EADCD5] shadow-md z-40"
              >
                <div className="max-w-6xl mx-auto px-4 py-3">
                  {/* Search input wrapper */}
                  <div className="relative w-full">
                    <Input
                      type="text"
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search lessons or units..."
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setHighlightedIndex((prev) =>
                            prev < results.length - 1 ? prev + 1 : 0
                          );
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setHighlightedIndex((prev) =>
                            prev > 0 ? prev - 1 : results.length - 1
                          );
                        } else if (e.key === "Enter" && highlightedIndex >= 0) {
                          e.preventDefault();
                          const selected = results[highlightedIndex];
                          if (selected) {
                            window.location.href = selected.href;
                          }
                        } else if (e.key === "Escape") {
                          setIsSearchOpen(false);
                        }
                      }}
                      className="w-full pl-10 pr-4 text-[#6B4C3B] placeholder:text-[#B59E90] focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-pink-400"
                    />
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B59E90] pointer-events-none"
                      size={18}
                    />
                    <button
                      onClick={() => {
                        if (query.trim().length > 0) {
                          router.push(`/search?q=${encodeURIComponent(query)}`);
                          setIsSearchOpen(false); // Optional: close suggestions
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B59E90] hover:text-[#A65A3A] transition"
                      aria-label="Search"
                    >
                      <ArrowRight size={18} />
                    </button>

                    {query.trim().length > 0 && (
                      <ScrollableResults className="absolute left-0 right-0 mt-2 z-50 rounded-md border border-[#EADCD5] bg-white shadow-sm divide-y divide-[#EADCD5]">
                        {renderResults()}
                      </ScrollableResults>
                    )}
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
