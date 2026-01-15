import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type ProgressPayload = {
  lessonId: string;
  viewedBlocks: number[];
  percentage: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} minutes and ${secs} seconds`;
}

export const syncAnonymousProgress = async (lessonId: string) => {
  const STORAGE_KEY = `ttok_lesson_${lessonId}_progress`;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  let local: (ProgressPayload & { lastViewedBlock?: number }) | null = null;
  try {
    local = JSON.parse(raw);
  } catch {
    return;
  }

  if (!local?.viewedBlocks?.length) return;

  const res = await fetch(`/api/progress/lesson?lessonId=${lessonId}`);
  let server: ProgressPayload | null = null;
  if (res.ok) {
    server = await res.json();
  }

  const mergedSet = new Set<number>();
  local.viewedBlocks.forEach((n) => mergedSet.add(n));
  server?.viewedBlocks?.forEach((n) => mergedSet.add(n));

  const mergedPercentage = Math.max(
    local.percentage ?? 0,
    server?.percentage ?? 0
  );

  await fetch("/api/progress/lesson", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lessonId,
      viewedBlocks: Array.from(mergedSet),
      percentage: mergedPercentage,
    }),
  });

  localStorage.removeItem(STORAGE_KEY);
};
