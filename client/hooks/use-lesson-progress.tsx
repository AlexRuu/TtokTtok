"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useProgressCommitter } from "@/hooks/use-progress-committer";

const STORAGE_KEY = (lessonId: string) => `ttok_lesson_${lessonId}_progress`;

type ProgressPayload = {
  lessonId: string;
  viewedBlocks: number[];
  percentage: number;
  lastViewedBlock: number;
  completed: boolean;
};

type ProgressData = {
  viewedBlocks: number[];
  percentage?: number;
  lastViewedBlock?: number;
  completed?: boolean;
};

export function useLessonProgress({
  lessonId,
  totalBlocks,
}: {
  lessonId: string;
  totalBlocks: number;
}) {
  /* ---------------- core state ---------------- */
  const [viewedBlocksSet, setViewedBlocksSet] = useState<Set<number>>(
    new Set(),
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastViewedBlock, setLastViewedBlock] = useState(-1);

  /* ---------------- refs ---------------- */
  const viewedBlocksRef = useRef<Set<number>>(new Set());
  const lastViewedBlockRef = useRef(-1);
  const lastSyncedPercentage = useRef(0);
  const hasHydratedInitialProgress = useRef(false);
  const hasMergedAnonymousProgress = useRef(false);
  const shouldResumeRef = useRef(false);
  const completedRef = useRef(false);

  /* ---------------- auth ---------------- */
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  /* ---------------- helpers ---------------- */
  const computePercent = useCallback(
    (blocks: Set<number>, isComplete: boolean) => {
      if (isComplete) return 100;
      return Math.round((blocks.size / Math.max(1, totalBlocks)) * 100);
    },
    [totalBlocks],
  );

  const progress = computePercent(viewedBlocksSet, completed);

  /* ---------------- sync ---------------- */
  const syncToServer = useCallback(
    async (force = false) => {
      if (!isAuthed) return;

      const percentage = computePercent(
        viewedBlocksRef.current,
        completedRef.current,
      );

      if (!force && percentage - lastSyncedPercentage.current < 5) return;

      const payload: ProgressPayload = {
        lessonId,
        viewedBlocks: Array.from(viewedBlocksRef.current),
        percentage,
        completed: completedRef.current,
        lastViewedBlock: lastViewedBlockRef.current,
      };

      try {
        await fetch("/api/progress/lesson", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        lastSyncedPercentage.current = percentage;
      } catch (e) {
        console.error("progress sync failed", e);
      }
    },
    [lessonId, isAuthed, computePercent],
  );

  const scheduleCommit = useProgressCommitter(syncToServer, 2000);

  /* ---------------- initial hydration ---------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/progress/lesson?lessonId=${lessonId}`);
        const serverData: ProgressData | null = res.ok
          ? await res.json()
          : null;

        const raw = localStorage.getItem(STORAGE_KEY(lessonId));
        const localData: ProgressData | null = raw ? JSON.parse(raw) : null;

        const merged = new Set<number>();
        serverData?.viewedBlocks?.forEach((n) => merged.add(n));
        localData?.viewedBlocks?.forEach((n) => merged.add(n));

        if (!mounted || hasHydratedInitialProgress.current) return;
        hasHydratedInitialProgress.current = true;

        // Determine if we should auto-resume scroll
        const maxIdx = merged.size > 0 ? Math.max(...Array.from(merged)) : -1;
        shouldResumeRef.current = maxIdx > 0;

        viewedBlocksRef.current = merged;
        setViewedBlocksSet(merged);

        lastViewedBlockRef.current = maxIdx;
        setLastViewedBlock(maxIdx);

        const isCompleted =
          localData?.completed === true || serverData?.percentage === 100;
        setCompleted(isCompleted);
        completedRef.current = isCompleted;

        lastSyncedPercentage.current = computePercent(merged, isCompleted);
      } catch (err) {
        console.error("Failed to hydrate progress", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, computePercent]);

  /* ---------------- anonymous → authed merge ---------------- */
  useEffect(() => {
    if (!isAuthed || hasMergedAnonymousProgress.current) return;

    const raw = localStorage.getItem(STORAGE_KEY(lessonId));
    if (!raw) {
      hasMergedAnonymousProgress.current = true;
      return;
    }

    const local = JSON.parse(raw);
    if (!local?.viewedBlocks?.length) {
      hasMergedAnonymousProgress.current = true;
      return;
    }

    scheduleCommit(true);
    localStorage.removeItem(STORAGE_KEY(lessonId));
    hasMergedAnonymousProgress.current = true;
  }, [isAuthed, lessonId, scheduleCommit]);

  /* ---------------- persistence ---------------- */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY(lessonId),
      JSON.stringify({
        viewedBlocks: Array.from(viewedBlocksSet),
        percentage: progress,
        completed,
        lastViewedBlock,
        updatedAt: Date.now(),
      }),
    );
  }, [viewedBlocksSet, progress, completed, lastViewedBlock, lessonId]);

  /* ---------------- actions ---------------- */
  const markBlockViewed = useCallback(
    (idx: number) => {
      setViewedBlocksSet((prev) => {
        if (prev.has(idx)) return prev;

        const next = new Set(prev);
        next.add(idx);

        viewedBlocksRef.current = next;

        lastViewedBlockRef.current = idx;
        setLastViewedBlock(idx);

        scheduleCommit();

        return next;
      });
    },
    [scheduleCommit],
  );

  const markComplete = useCallback(() => {
    const allBlocks = new Set<number>();

    for (let i = 0; i < totalBlocks; i++) {
      allBlocks.add(i);
    }

    // Sync refs first (important)
    viewedBlocksRef.current = allBlocks;
    completedRef.current = true;
    lastViewedBlockRef.current = totalBlocks - 1;

    // Then update React state
    setViewedBlocksSet(allBlocks);
    setLastViewedBlock(totalBlocks - 1);
    setCompleted(true);

    // Force server sync
    scheduleCommit(true);
  }, [scheduleCommit, totalBlocks]);

  return {
    viewedBlocks: viewedBlocksSet,
    viewedBlocksRef,
    shouldResumeRef,
    markBlockViewed,
    markComplete,
    progress,
    completed,
    loading,
    lastViewedBlock,
  };
}
