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

export const getRandomSubset = <T>(items: T[], size: number): T[] => {
  return [...items].sort(() => Math.random() - 0.5).slice(0, size);
};
