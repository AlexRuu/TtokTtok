"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type VocabularyWithRelations = {
  id: string;
  title: string;
  lesson: {
    id: string;
    title: string;
    slug: string;
    lessonNumber: number;
    unit: { id: string; title: string; slug: string };
  };
};

type GroupedUnit = {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    lessonNumber: number;
    slug: string;
    vocabularyTitle: string;
    unitSlug: string;
  }[];
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const VocabularyDisplay = ({
  vocabularyList,
}: {
  vocabularyList: VocabularyWithRelations[];
}) => {
  const [openUnit, setOpenUnit] = useState<string | null>(null);

  // Group by unit using Map
  const groupedMap = new Map<string, GroupedUnit>();
  vocabularyList.forEach((vocab) => {
    const unitId = vocab.lesson.unit.id;
    if (!groupedMap.has(unitId)) {
      groupedMap.set(unitId, {
        id: unitId,
        title: vocab.lesson.unit.title,
        lessons: [],
      });
    }
    groupedMap.get(unitId)!.lessons.push({
      id: vocab.lesson.id,
      title: vocab.lesson.title,
      lessonNumber: vocab.lesson.lessonNumber,
      slug: vocab.lesson.slug,
      vocabularyTitle: vocab.title,
      unitSlug: vocab.lesson.unit.slug,
    });
  });

  const grouped = Array.from(groupedMap.values());
  grouped.forEach((unit) =>
    unit.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber),
  );

  return (
    <div className="space-y-10">
      {grouped.map((unit) => {
        const isOpen = openUnit === unit.id;

        return (
          <section
            key={unit.id}
            id={`unit-${unit.id}`}
            className="rounded-3xl bg-[#FFFDFB] border border-[#F3E4DA] px-7 py-6 scroll-mt-24 transition hover:shadow-sm"
          >
            {/* Unit Header */}
            <motion.button
              onClick={() => setOpenUnit(isOpen ? null : unit.id)}
              aria-expanded={isOpen}
              aria-controls={`unit-${unit.id}-content`}
              className="w-full text-left flex items-center justify-between hover:cursor-pointer"
            >
              <div className="space-y-1">
                <p className="text-lg font-medium text-[#6B4C3B]">
                  {unit.title}
                </p>
                <p className="text-sm text-[#C1A08A] mb-2">
                  {unit.lessons.length} vocabulary set
                  {unit.lessons.length > 1 ? "s" : ""}
                </p>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-[#C1A08A]"
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>

            {/* Collapsible Lessons */}
            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                className="pl-3 space-y-1.5"
              >
                {unit.lessons.map((lesson) => (
                  <motion.li
                    key={lesson.id}
                    className="space-y-2"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link
                      href={`/units/${lesson.unitSlug}/lessons/${lesson.slug}/vocabulary`}
                      className="block rounded-xl px-3 py-2 transition hover:bg-[#FCF4EF]"
                    >
                      <p className="text-[15px] font-normal text-[#7A5C4B]">
                        {lesson.vocabularyTitle}
                      </p>
                      <p className="text-xs text-[#BFA391] mt-0.5">
                        Lesson {lesson.lessonNumber} – {lesson.title}
                      </p>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
};

export default VocabularyDisplay;
