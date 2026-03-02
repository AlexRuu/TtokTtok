"use client";

import Link from "next/link";
import { Unit, Tag } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface GroupedLessonsProps {
  units: Unit[];
  tags: Tag[];
}

interface UnitSectionProps {
  unit: Unit;
  autoOpen?: boolean;
  searchLower?: string;
}

// Adjustable batch size for "Load More"
const BATCH_SIZE = 5;

// Highlight search matches
const highlightMatch = (text: string, search: string) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[#FFF0E0] text-[#6B4C3B] rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const UnitSection = ({
  unit,
  autoOpen = false,
  searchLower = "",
}: UnitSectionProps) => {
  const [isOpen, setIsOpen] = useState(autoOpen);

  // Re-evaluate open state whenever autoOpen changes
  useEffect(() => {
    setIsOpen(autoOpen);
  }, [autoOpen]);

  return (
    <section
      aria-labelledby={`unit-${unit.unitNumber}-title`}
      className="rounded-3xl bg-[#FFFDFB] border border-[#F3E4DA] px-7 py-6 transition hover:shadow-sm"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between group hover:cursor-pointer"
      >
        <div className="space-y-1">
          <p className="text-xs tracking-widest uppercase text-[#C8A994]">
            Unit {unit.unitNumber}
          </p>

          <h2
            id={`unit-${unit.unitNumber}-title`}
            className="text-lg font-medium text-[#6B4C3B]"
          >
            {highlightMatch(unit.title, searchLower)}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#B08974]">
            {unit.lesson.length} lessons
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#C1A08A]"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Expandable Lessons */}
      <motion.ul
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="mt-6 space-y-2 overflow-hidden"
      >
        {unit.lesson.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/units/${unit.slug}/lessons/${lesson.slug}`}
              className="block rounded-xl px-4 py-3 transition hover:bg-[#F8ECE6]"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#C1A08A] w-8">
                  {lesson.lessonNumber}
                </span>

                <span className="flex-1 text-[15px] font-normal text-[#6B4C3B]">
                  {highlightMatch(lesson.title, searchLower)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </motion.ul>
    </section>
  );
};

const GroupedLessons = ({ units, tags }: GroupedLessonsProps) => {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const searchLower = search.trim().toLowerCase();

  // Filter units and lessons based on search and tag
  const filteredUnits: Unit[] = useMemo(() => {
    return units
      .map((unit) => {
        // Filter lessons by both search and tag
        const filteredLessons = unit.lesson.filter((lesson) => {
          const matchesSearch =
            lesson.title.toLowerCase().includes(searchLower) ||
            lesson.lessonNumber.toString() === searchLower ||
            lesson.tagging?.some((t) =>
              t.tag.name.toLowerCase().includes(searchLower),
            );

          const matchesTag = activeTag
            ? lesson.tagging?.some((t) => t.tag.id === activeTag)
            : true;

          return matchesSearch && matchesTag;
        });

        // Only include units that have at least one matching lesson
        if (filteredLessons.length > 0) {
          return { ...unit, lesson: filteredLessons };
        }

        // Optional: if user searches for unit title directly, show it with empty lessons
        const unitMatchesSearch =
          unit.title.toLowerCase().includes(searchLower) ||
          unit.unitNumber.toString() === searchLower;

        if (unitMatchesSearch && !activeTag) {
          return { ...unit, lesson: [] };
        }

        // Otherwise, hide the unit
        return null;
      })
      .filter(Boolean) as Unit[];
  }, [units, searchLower, activeTag]);

  const filteredTags = tags.filter(
    (tag) => tag.name !== "Vocabulary" && tag.name !== "Quiz",
  );
  const unitsToShow = filteredUnits.slice(0, visibleCount);
  const hasMore = visibleCount < filteredUnits.length;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search units, lessons, numbers, or tags..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(BATCH_SIZE); // reset batch on search
          }}
          className="w-full rounded-2xl border border-[#F3E4DA] bg-[#FFFDFB] px-5 py-3 text-sm placeholder-[#C1A08A] focus:outline-none focus:ring-2 focus:ring-[#E7C2AF] transition"
        />
      </div>

      {/* Tag filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filteredTags.map((tag) => {
            const selected = tag.id === activeTag;
            return (
              <button
                key={tag.id}
                onClick={() => setActiveTag(selected ? null : tag.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition hover:cursor-pointer ${
                  selected
                    ? "bg-[#F3E4DA] text-[#6B4C3B]"
                    : "bg-[#FFFDFB] text-[#B08974] border border-[#F3E4DA] hover:bg-[#F8ECE6]"
                }`}
                style={{
                  backgroundColor: selected
                    ? tag.backgroundColour
                    : "transparent",
                  color: selected ? tag.textColour : tag.textColour,
                  borderColor: tag.borderColour,
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {unitsToShow.length === 0 && (
        <p className="text-center text-[#9A6B55]">
          {search && activeTag && (
            <>
              No results for "<span className="font-medium">{search}</span>"
              with the "
              <span className="font-medium">
                {tags.find((t) => t.id === activeTag)?.name}
              </span>
              " tag
            </>
          )}

          {!search && activeTag && (
            <>
              No results with the "
              <span className="font-medium">
                {tags.find((t) => t.id === activeTag)?.name}
              </span>
              " tag
            </>
          )}

          {search && !activeTag && (
            <>
              No results for "<span className="font-medium">{search}</span>"
            </>
          )}
        </p>
      )}

      {/* Render units */}
      {unitsToShow.map((unit) => {
        // Only auto-open units that have matching lessons or match the search
        const shouldAutoOpen =
          searchLower.length > 0 &&
          (unit.title.toLowerCase().includes(searchLower) ||
            unit.lesson.some((lesson) =>
              lesson.title.toLowerCase().includes(searchLower),
            ));

        return (
          <UnitSection
            key={unit.unitNumber}
            unit={unit}
            autoOpen={shouldAutoOpen}
            searchLower={searchLower}
          />
        );
      })}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
            className="px-6 py-2 rounded-lg bg-[#F0D9C6] text-[#6B4C3B] font-medium hover:bg-[#D89C84] hover:text-white transition"
          >
            Load More Units
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupedLessons;
