"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = (lessonId: string) => `ttok_lesson_${lessonId}_progress`;
const DEBOUNCE_MS = 30_000;

type ProgressPayload = {
  lessonId: string;
  viewedBlocks: number[];
  percentage: number;
};

export function useLessonProgress({
  lessonId,
  totalBlocks,
  fetchServerProgress,
}: {
  lessonId: string;
  totalBlocks: number;
  fetchServerProgress?: () => Promise<{
    viewedBlocks: number[];
    percentage: number;
  } | null>;
}) {
  const [viewedBlocksSet, setViewedBlocksSet] = useState<Set<number>>(
    new Set()
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const debounceTimer = useRef<number | null>(null);
  const lastViewedBlockRef = useRef<number>(-1);
  const [lastViewedBlock, setLastViewedBlock] = useState(-1);
  const lastSyncedPercentage = useRef<number>(0);
  const isUnmounting = useRef(false);
  const hasMergedAnonymousProgress = useRef(false);
  const viewedBlocksRef = useRef<Set<number>>(new Set());

  // helper: compute percentage from viewedBlocks
  const computePercent = useCallback(() => {
    return completed
      ? 100
      : Math.round((viewedBlocksSet.size / Math.max(1, totalBlocks)) * 100);
  }, [viewedBlocksSet, completed, totalBlocks]);

  // load localStorage and optionally server
  useEffect(() => {
    let mounted = true;
    (async () => {
      const raw = localStorage.getItem(STORAGE_KEY(lessonId));
      let local = null;
      if (raw) {
        try {
          local = JSON.parse(raw);
        } catch {}
      }

      let server = null;
      if (fetchServerProgress) {
        try {
          server = await fetchServerProgress();
        } catch {}
      }

      const merged = new Set<number>();
      server?.viewedBlocks?.forEach((n) => merged.add(n));
      local?.viewedBlocks?.forEach((n: number) => merged.add(n));

      if (!mounted) return;

      setViewedBlocksSet((prev) => {
        const next = new Set(prev);
        merged.forEach((n) => next.add(n));
        return next;
      });

      const maxIdx =
        merged.size > 0 ? Math.max(...Array.from(merged.values())) : -1;

      lastViewedBlockRef.current = maxIdx;
      setLastViewedBlock(maxIdx);

      setCompleted(local?.completed ?? server?.percentage === 100);
      lastSyncedPercentage.current = Math.max(
        server?.percentage ?? 0,
        local?.percentage ?? 0
      );
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, fetchServerProgress]);

  useEffect(() => {
    viewedBlocksRef.current = viewedBlocksSet;
  }, [viewedBlocksSet]);

  useEffect(() => {
    if (!isAuthed) return;
    if (hasMergedAnonymousProgress.current) return;

    const raw = localStorage.getItem(STORAGE_KEY(lessonId));
    if (!raw) {
      hasMergedAnonymousProgress.current = true;
      return;
    }

    let local;
    try {
      local = JSON.parse(raw);
    } catch {
      hasMergedAnonymousProgress.current = true;
      return;
    }

    if (!local?.viewedBlocks?.length) {
      hasMergedAnonymousProgress.current = true;
      return;
    }

    (async () => {
      try {
        const payload = {
          viewedBlocks: Array.from(viewedBlocksSet.values()),
          percentage: completed ? 100 : computePercent(),
          completed,
          lastViewedBlock,
          updatedAt: Date.now(),
        };

        await fetch("/api/progress/lesson", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        lastSyncedPercentage.current = Math.max(
          lastSyncedPercentage.current,
          payload.percentage
        );

        localStorage.removeItem(STORAGE_KEY(lessonId));
      } catch (e) {
        console.error("anonymous merge failed", e);
      } finally {
        hasMergedAnonymousProgress.current = true;
      }
    })();
  }, [isAuthed, lessonId]);

  // save to localStorage when viewedBlocks or completed changes
  useEffect(() => {
    const payload = {
      viewedBlocks: Array.from(viewedBlocksSet.values()),
      percentage: computePercent(),
      completed,
      lastViewedBlock,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY(lessonId), JSON.stringify(payload));
  }, [viewedBlocksSet, completed, lastViewedBlock, lessonId, computePercent]);

  // debounced sync to server
  const scheduleSync = useCallback(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    debounceTimer.current = window.setTimeout(async () => {
      try {
        const payload: ProgressPayload = {
          lessonId,
          viewedBlocks: Array.from(viewedBlocksSet.values()),
          percentage: computePercent(),
        };
        // avoid sending if not increased since last sync
        if (payload.percentage <= lastSyncedPercentage.current) return;
        const res = await fetch("/api/progress/lesson", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          lastSyncedPercentage.current = payload.percentage;
        }
      } catch (e) {
        console.error("sync error", e);
      }
    }, DEBOUNCE_MS) as unknown as number;
  }, [lessonId, viewedBlocksSet, computePercent]);

  // final sync on unload
  useEffect(() => {
    const onUnload = () => {
      // clear timers
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      // attempt synchronous navigator.sendBeacon if available
      try {
        const payload = {
          lessonId,
          viewedBlocks: Array.from(viewedBlocksSet.values()),
          percentage: computePercent(),
        };
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/progress/lesson", JSON.stringify(payload));
        } else {
          // fallback: synchronous XHR (rare)
          const xhr = new XMLHttpRequest();
          xhr.open("PATCH", "/api/progress/lesson", false);
          xhr.setRequestHeader("Content-Type", "application/json");
          try {
            xhr.send(JSON.stringify(payload));
          } catch (e) {
            /* ignore */
          }
        }
      } catch (e) {}
    };

    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onUnload);

    return () => {
      isUnmounting.current = true;
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [lessonId, viewedBlocksSet, computePercent]);

  const markBlockViewed = useCallback(
    (idx: number) => {
      setViewedBlocksSet((prev) => {
        if (prev.has(idx)) return prev;
        const updated = new Set(prev);
        updated.add(idx);
        viewedBlocksRef.current = updated;
        return updated;
      });
      setLastViewedBlock(idx);
      lastViewedBlockRef.current = idx;
      scheduleSync();
    },
    [scheduleSync]
  );

  // In markComplete:
  const markComplete = useCallback(async () => {
    setCompleted(true);

    try {
      const payload: ProgressPayload = {
        lessonId,
        viewedBlocks: Array.from(viewedBlocksSet.values()),
        percentage: 100,
      };
      await fetch("/api/progress/lesson", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      lastSyncedPercentage.current = 100;
    } catch (e) {
      console.error("complete sync failed", e);
    }
  }, [lessonId, viewedBlocksSet]);

  return {
    viewedBlocks: viewedBlocksSet,
    viewedBlocksRef,
    markBlockViewed,
    markComplete,
    progress: computePercent(),
    completed,
    loading,
    lastViewedBlock,
  };
}
