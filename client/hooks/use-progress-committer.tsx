import { useCallback, useRef } from "react";

type CommitFn = (force?: boolean) => Promise<void>;

/**
 * Handles debounced + forced commits to the server
 *
 * @param commitFn - function that actually sends data to server
 * @param debounceMs - optional debounce duration, default 2s
 */
export const useProgressCommitter = (commitFn: CommitFn, debounceMs = 2000) => {
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Schedule a commit.
   * @param force - immediately commit regardless of debounce
   */
  const scheduleCommit = useCallback(
    (force = false) => {
      if (commitTimer.current) clearTimeout(commitTimer.current);

      commitTimer.current = setTimeout(
        () => {
          commitFn(force);
          commitTimer.current = null;
        },
        force ? 0 : debounceMs
      );
    },
    [commitFn, debounceMs]
  );

  return scheduleCommit;
};
