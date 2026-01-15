"use client";

import { useEffect, useRef, useCallback } from "react";
import type { LessonBlock } from "@/types";

type UseBlockObserverProps = {
  content: LessonBlock[];
  markBlockViewed: (idx: number) => void;
  viewedBlocksRef: React.RefObject<Set<number>>;
};

export const useBlockObserver = ({
  content,
  markBlockViewed,
  viewedBlocksRef,
}: UseBlockObserverProps) => {
  // Refs
  const dwellTimersRef = useRef<Map<number, number>>(new Map());
  const observedBlocksRef = useRef<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const markBlockViewedRef = useRef(markBlockViewed);
  const contentRef = useRef(content);

  markBlockViewedRef.current = markBlockViewed;
  contentRef.current = content;

  // Default dwell times
  const getDwellTime = useCallback((block: LessonBlock) => {
    switch (block.type) {
      case "text":
        return 1200;
      case "image":
        return 1800;
      case "note":
        return 1500;
      case "table":
        return 2500;
      default:
        return 1200;
    }
  }, []);

  // Observe unobserved blocks in the DOM
  const observeBlocks = useCallback(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-block-index]");
    els.forEach((el) => {
      const idx = Number(el.dataset.blockIndex);
      if (!observedBlocksRef.current.has(idx) && observerRef.current) {
        observerRef.current.observe(el);
        observedBlocksRef.current.add(idx);
      }
    });
  }, []);

  useEffect(() => {
    // Initialize observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = Number(el.dataset.blockIndex);

          if (viewedBlocksRef.current.has(idx)) return;

          // Start dwell timer
          if (entry.isIntersecting && !dwellTimersRef.current.has(idx)) {
            const dwell = getDwellTime(contentRef.current[idx]);
            const timer = window.setTimeout(() => {
              markBlockViewedRef.current(idx);
              dwellTimersRef.current.delete(idx);
            }, dwell);
            dwellTimersRef.current.set(idx, timer);
          }
          // Clear dwell timer if leaving viewport
          else if (!entry.isIntersecting) {
            const timer = dwellTimersRef.current.get(idx);
            if (timer) {
              clearTimeout(timer);
              dwellTimersRef.current.delete(idx);
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px" }
    );

    // Start observing blocks
    observeBlocks();

    // Cleanup on unmount
    return () => {
      dwellTimersRef.current.forEach(clearTimeout);
      dwellTimersRef.current.clear();
      observerRef.current?.disconnect();
    };
  }, [observeBlocks, getDwellTime]);

  return { observeBlocks };
};
