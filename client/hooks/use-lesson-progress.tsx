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
  const [viewedBlocksSet, setViewedBlocksSet] = useState<Set<number>>(
    new Set()
  );
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastViewedBlock, setLastViewedBlock] = useState(-1);

  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const viewedBlocksRef = useRef<Set<number>>(new Set());
  const lastViewedBlockRef = useRef<number>(-1);
  const lastSyncedPercentage = useRef<number>(0);
  const hasMergedAnonymousProgress = useRef(false);

  /* ---------------- progress compute ---------------- */
  const progressRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  const computePercent = useCallback(() => {
    if (completed) return 100;
    return Math.round((viewedBlocksSet.size / Math.max(1, totalBlocks)) * 100);
  }, [viewedBlocksSet, completed, totalBlocks]);

  useEffect(() => {
    const pct = computePercent();
    progressRef.current = pct;
    setProgress(pct);
  }, [viewedBlocksSet, completed, computePercent]);

  /* ---------------- sync ---------------- */
  const syncToServer = useCallback(
    async (force = false) => {
      if (!isAuthed) return;
      const percentage = computePercent();
      if (!force && percentage - lastSyncedPercentage.current < 5) return;

      const payload: ProgressPayload = {
        lessonId,
        viewedBlocks: Array.from(viewedBlocksRef.current),
        percentage,
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
    [lessonId, isAuthed, computePercent]
  );

  const scheduleCommit = useProgressCommitter(syncToServer, 2000);

  /* ---------------- initial load ---------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1️⃣ Fetch server progress ONCE
        const res = await fetch(`/api/progress/lesson?lessonId=${lessonId}`);
        const serverData: ProgressData | null = res.ok
          ? await res.json()
          : null;

        // 2️⃣ Load local progress
        const raw = localStorage.getItem(STORAGE_KEY(lessonId));
        const localData: ProgressData | null = raw ? JSON.parse(raw) : null;

        // 3️⃣ Merge
        const merged = new Set<number>();
        serverData?.viewedBlocks?.forEach((n: number) => merged.add(n));
        localData?.viewedBlocks?.forEach((n: number) => merged.add(n));

        if (!mounted) return;

        setViewedBlocksSet(merged);
        viewedBlocksRef.current = merged;

        const maxIdx = merged.size > 0 ? Math.max(...Array.from(merged)) : -1;
        setLastViewedBlock(maxIdx);
        lastViewedBlockRef.current = maxIdx;

        setCompleted(
          localData?.completed === true || serverData?.percentage === 100
        );
        lastSyncedPercentage.current = Math.max(
          serverData?.percentage ?? 0,
          localData?.percentage ?? 0
        );
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  /* ---------------- anonymous → authed merge ---------------- */
  useEffect(() => {
    if (!isAuthed || hasMergedAnonymousProgress.current) return;

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

    scheduleCommit(true);
    localStorage.removeItem(STORAGE_KEY(lessonId));
    hasMergedAnonymousProgress.current = true;
  }, [isAuthed, lessonId, scheduleCommit]);

  /* ---------------- localStorage persistence ---------------- */
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

  /* ---------------- page exit safety sync ---------------- */
  useEffect(() => {
    const flush = () => {
      if (!isAuthed) return;
      navigator.sendBeacon?.(
        "/api/progress/lesson",
        JSON.stringify({
          lessonId,
          viewedBlocks: Array.from(viewedBlocksRef.current),
          percentage: computePercent(),
          lastViewedBlock: lastViewedBlockRef.current,
        })
      );
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [lessonId, isAuthed, computePercent]);

  /* ---------------- public actions ---------------- */
  const markBlockViewed = useCallback(
    (idx: number) => {
      viewedBlocksRef.current.add(idx);
      setViewedBlocksSet(new Set(viewedBlocksRef.current));

      lastViewedBlockRef.current = idx;
      setLastViewedBlock(idx);

      scheduleCommit();
    },
    [scheduleCommit]
  );

  const markComplete = useCallback(() => {
    setCompleted(true);
    lastViewedBlockRef.current = totalBlocks - 1;
    scheduleCommit(true);
  }, [scheduleCommit, totalBlocks]);

  return {
    viewedBlocks: viewedBlocksSet,
    viewedBlocksRef,
    markBlockViewed,
    markComplete,
    progress,
    completed,
    loading,
    lastViewedBlock,
  };
}
