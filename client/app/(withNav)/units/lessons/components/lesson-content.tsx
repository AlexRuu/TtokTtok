"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextBlock from "./text-block";
import ImageBlock from "./image-block";
import NoteBlock from "./note-block";
import TableBlock from "./table-block";
import Link from "next/link";
import type { LessonBlock } from "@/types";
import { useLessonProgress } from "@/hooks/use-lesson-progress";
import { useBlockObserver } from "@/hooks/use-observer-block";

const COMPLETE_PERCENT = 90;

type NextStep = {
  title: string;
  description: string;
  href: string;
};

const LessonContent = ({
  content,
  lessonId,
}: {
  content: LessonBlock[];
  lessonId: string;
}) => {
  const totalBlocks = content.length;
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const hasAutoScrolled = useRef(false);

  const {
    markBlockViewed,
    progress,
    markComplete,
    viewedBlocksRef,
    completed,
    loading,
    shouldResumeRef,
    lastViewedBlock,
  } = useLessonProgress({ lessonId, totalBlocks });

  const handleMarkComplete = useCallback(() => {
    markComplete();
    setShowCompleteButton(false);
    setLessonComplete(true);
  }, [markComplete]);

  /* ---------------- IntersectionObserver ---------------- */
  const { observeBlocks, resetObserver } = useBlockObserver({
    content,
    markBlockViewed,
    viewedBlocksRef,
  });

  useEffect(() => {
    if (loading) return;
    resetObserver();
  }, [loading, resetObserver]);

  /* ---------------- Auto-scroll to last viewed block ---------------- */
  useEffect(() => {
    if (loading) return;
    if (!shouldResumeRef.current) return;
    if (hasAutoScrolled.current) return;
    if (lastViewedBlock < 0) return;

    const el = document.querySelector<HTMLElement>(
      `[data-block-index="${lastViewedBlock}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      hasAutoScrolled.current = true;
    }
  }, [loading, lastViewedBlock, shouldResumeRef]);

  /* ---------------- Show "Mark Complete" button ---------------- */
  useEffect(() => {
    setShowCompleteButton(progress >= COMPLETE_PERCENT && !completed);
  }, [progress, completed]);

  /* ---------------- Animate next steps ---------------- */
  useEffect(() => {
    setLessonComplete(completed);
  }, [completed]);

  const nextSteps = useMemo<NextStep[]>(
    () => [
      {
        title: "Take the Quiz",
        description: "Test your understanding of this lesson.",
        href: "/quiz/lesson-1",
      },
      {
        title: "Review Vocabulary",
        description: "Go over the key words from this lesson.",
        href: "/vocabulary/lesson-1",
      },
      {
        title: "Next Lesson",
        description: "Continue your learning journey.",
        href: "/lessons/lesson-2",
      },
    ],
    [],
  );

  return (
    <article className="space-y-6">
      {content.map((block, idx) => {
        const inner =
          block.type === "text" ? (
            <TextBlock key={idx} content={block.content} />
          ) : block.type === "image" ? (
            <ImageBlock key={idx} url={block.url} alt={block.alt} />
          ) : block.type === "note" ? (
            <NoteBlock key={idx} content={block.content} style={block.style} />
          ) : block.type === "table" ? (
            <TableBlock
              key={idx}
              headers={block.headers}
              rows={block.rows}
              note={block.note}
            />
          ) : null;

        return (
          <div key={idx} data-block-index={idx} aria-hidden={false}>
            {inner}
          </div>
        );
      })}

      {/* Progress Pill */}
      <div className="mt-6">
        <div className="relative h-8 rounded-full bg-[#F3E8E0] shadow-inner overflow-hidden border border-[#E8D7C3]">
          <motion.div
            className="h-full rounded-full bg-[#D89C84]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <span
            className={`absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none transition-colors duration-300 ${
              progress >= 50 ? "text-white" : "text-[#5A4231]"
            }`}
          >
            {progress}%
          </span>
        </div>

        {showCompleteButton && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleMarkComplete}
              className="px-5 py-2 rounded-xl bg-[#F3DCCB] text-[#6B4C3B] font-semibold shadow hover:bg-[#EBC9B1] transition cursor-pointer select-none"
            >
              Mark Complete
            </button>
          </div>
        )}
      </div>

      {/* Animated Next Steps */}
      <AnimatePresence>
        {lessonComplete && (
          <motion.section
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ staggerChildren: 0.1 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#6B4C3B]">
              Next Steps
            </h2>
            <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nextSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col h-full"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  <Link
                    href={step.href}
                    className="flex flex-col flex-1 p-4 rounded-xl bg-[#FFF1E8] border border-[#E8D7C3] shadow hover:shadow-md transition hover:cursor-pointer"
                  >
                    <div className="flex-1 grid grid-rows-[auto_auto_1fr]">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-[#A67C66]">
                        {step.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </article>
  );
};

export default LessonContent;
