"use client";

import { Vocabulary } from "@/types";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { getRandomSubset } from "@/lib/utils";

interface Props {
  vocabulary: Vocabulary[];
}

const STUDY_SIZE = 6;

const StudySession = ({ vocabulary }: Props) => {
  const [studySet, setStudySet] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [revealedMap, setRevealedMap] = useState<Record<number, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Pick random subset when vocabulary changes
  useEffect(() => {
    const subset = getRandomSubset(vocabulary, STUDY_SIZE);
    setStudySet(subset);
    setIndex(0);
    setRevealedMap({});
  }, [vocabulary]);

  const handleNext = () => {
    setRevealedMap((prev) => ({ ...prev, [index]: false }));
    setIndex((i) => Math.min(i + 1, studySet.length - 1));
  };

  const handleBack = () => {
    setRevealedMap((prev) => ({ ...prev, [index]: false }));
    setIndex((i) => Math.max(i - 1, 0));
  };

  const toggleReveal = (i: number) => {
    setRevealedMap((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // Animate carousel position when index changes
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth || 1;
    const targetX = -index * containerWidth;
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  }, [index, x]);

  if (studySet.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Carousel */}
      <div className="relative overflow-hidden rounded-3xl">
        <motion.div
          className="flex w-full cursor-grab"
          style={{ x }}
          ref={containerRef}
          drag="x"
          dragConstraints={{
            left: -(
              (studySet.length - 1) *
              (containerRef.current?.offsetWidth || 0)
            ),
            right: 0,
          }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const threshold = 80;
            if (info.offset.x < -threshold && index < studySet.length - 1) {
              handleNext();
            } else if (info.offset.x > threshold && index > 0) {
              handleBack();
            } else {
              // snap back to current index
              if (!containerRef.current) return;
              const width = containerRef.current.offsetWidth || 1;
              animate(x, -index * width, {
                type: "spring",
                stiffness: 300,
                damping: 30,
              });
            }
          }}
        >
          {studySet.map((vocab, i) => {
            const isRevealed = revealedMap[i] ?? false;
            return (
              <div
                key={vocab.id}
                className="shrink-0 w-full flex justify-center items-center px-6 py-8 min-h-[475px]"
              >
                {/* Flip Card */}
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => !isDragging && toggleReveal(i)}
                  style={{ perspective: 1000 }}
                >
                  {/* Front */}
                  <motion.div
                    className="absolute w-full h-full rounded-3xl bg-[#FFE8D6] border border-[#FFD7C2] shadow-lg flex flex-col justify-center items-center px-6 py-10 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                    animate={{
                      rotateY: isRevealed ? 180 : 0,
                      scale: isRevealed ? 1.05 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 18,
                      mass: 0.5,
                    }}
                  >
                    <p className="text-6xl font-bold tracking-tight text-[#6B4C3B]">
                      {vocab.korean}
                    </p>
                    <p className="mt-4 text-sm text-[#B08968] italic">
                      Click to reveal
                    </p>
                  </motion.div>

                  {/* Back */}
                  <motion.div
                    className="absolute w-full h-full rounded-3xl bg-[#FFF0E0] border border-[#FFD7C2] shadow-lg flex flex-col justify-center items-center px-6 py-10 text-center"
                    style={{ backfaceVisibility: "hidden", rotateY: 180 }}
                    animate={{
                      rotateY: isRevealed ? 0 : 180,
                      scale: isRevealed ? 1.05 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 18,
                      mass: 0.5,
                    }}
                  >
                    <p className="text-6xl font-bold tracking-tight text-[#6B4C3B]">
                      {vocab.korean}
                    </p>
                    <div className="w-4/5 h-0.5 opacity-20 my-5 bg-black" />
                    <p className="text-xl font-semibold text-[#6B4C3B]">
                      {vocab.english}
                    </p>
                    <p className="text-md text-[#8A6B5A] mt-2">
                      {vocab.definition}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation + Dots */}
      <div className="flex items-center justify-between gap-4 mt-4 ">
        {/* Back */}
        {index > 0 ? (
          <button
            onClick={handleBack}
            className="w-10 h-10 hover:cursor-pointer rounded-full flex items-center justify-center shadow-md bg-[#FFD7C2] hover:bg-[#FFC9A8] transition-colors text-[#6B4C3B] font-bold text-lg"
          >
            ←
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}

        {/* Dots */}
        <div className="flex gap-2">
          {studySet.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setRevealedMap((prev) => ({ ...prev, [index]: false }));
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all hover:cursor-pointer ${
                i === index
                  ? "w-8 bg-[#6B4C3B]"
                  : "w-2 bg-[#6B4C3B]/30 hover:w-4 hover:bg-[#6B4C3B]/50"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        {index < studySet.length - 1 ? (
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full hover:cursor-pointer flex items-center justify-center shadow-md bg-[#FFD7C2] hover:bg-[#FFC9A8] transition-colors text-[#6B4C3B] font-bold text-lg"
          >
            →
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </div>
  );
};

export default StudySession;
