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
  /* ---------------- refs ---------------- */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedBlocksRef = useRef<Set<number>>(new Set());
  const dwellTimersRef = useRef<Map<number, number>>(new Map());

  const markBlockViewedRef = useRef(markBlockViewed);
  const contentRef = useRef(content);

  markBlockViewedRef.current = markBlockViewed;
  contentRef.current = content;

  /* ---------------- dwell times ---------------- */
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

  /* ---------------- observe blocks ---------------- */
  const observeBlocks = useCallback(() => {
    if (!observerRef.current) return;

    const els = document.querySelectorAll<HTMLElement>("[data-block-index]");
    els.forEach((el) => {
      const idx = Number(el.dataset.blockIndex);

      if (Number.isNaN(idx)) return;
      if (observedBlocksRef.current.has(idx)) return;

      observerRef.current!.observe(el);
      observedBlocksRef.current.add(idx);
    });
  }, []);

  /* ---------------- reset observer ---------------- */
  const resetObserver = useCallback(() => {
    observerRef.current?.disconnect();
    observedBlocksRef.current.clear();

    dwellTimersRef.current.forEach(clearTimeout);
    dwellTimersRef.current.clear();

    observeBlocks();
  }, [observeBlocks]);

  /* ---------------- observer setup ---------------- */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = Number(el.dataset.blockIndex);

          if (Number.isNaN(idx)) return;

          // Never track blocks already viewed
          if (viewedBlocksRef.current.has(idx)) return;

          if (entry.isIntersecting) {
            if (dwellTimersRef.current.has(idx)) return;

            const block = contentRef.current[idx];
            if (!block) return;

            const dwell = getDwellTime(block);
            const timer = window.setTimeout(() => {
              markBlockViewedRef.current(idx);
              dwellTimersRef.current.delete(idx);
            }, dwell);

            dwellTimersRef.current.set(idx, timer);
          } else {
            const timer = dwellTimersRef.current.get(idx);
            if (timer) {
              clearTimeout(timer);
              dwellTimersRef.current.delete(idx);
            }
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px",
      },
    );

    observeBlocks();

    return () => {
      observerRef.current?.disconnect();
      dwellTimersRef.current.forEach(clearTimeout);
      dwellTimersRef.current.clear();
    };
  }, [observeBlocks, getDwellTime, viewedBlocksRef]);

  return {
    observeBlocks,
    resetObserver,
  };
};
