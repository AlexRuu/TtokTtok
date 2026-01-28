"use client";

import Link from "next/link";
import { Unit } from "@/types";
import { BookOpen, FileText } from "lucide-react";

interface GroupedLessonsProps {
  units: Unit[];
}

const GroupedLessons = ({ units }: GroupedLessonsProps) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-12">
      {units.map((unit) => (
        <section
          key={unit.unitNumber}
          className="bg-[#FFF3E8] rounded-3xl p-8 shadow-md border border-[#F0D9C6] transition-transform hover:scale-[1.02] hover:shadow-lg focus-within:scale-[1.02] focus-within:shadow-lg"
          tabIndex={-1}
          aria-labelledby={`unit-${unit.unitNumber}-title`}
        >
          <header className="mb-6 flex items-center space-x-3">
            {/* Unit icon */}
            <div className="bg-[#D89C84] rounded-full p-2 flex items-center justify-center shadow-sm">
              <BookOpen className="text-white w-5 h-5" aria-hidden="true" />
            </div>

            <h2
              id={`unit-${unit.unitNumber}-title`}
              className="text-2xl font-semibold text-[#6B4C3B] tracking-wide"
            >
              {unit.unitNumber}. {unit.title}
            </h2>
          </header>

          <ul className="flex flex-wrap gap-4">
            {unit.lesson.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/units/${unit.slug}/lessons/${lesson.slug}`}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#F0D9C6] text-[#6B4C3B] font-medium shadow-sm hover:bg-[#D89C84] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D89C84] transition duration-200"
                >
                  {/* Lesson icon */}
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lesson.lessonNumber}. {lesson.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default GroupedLessons;
