"use client";

import { UnitWithLessons } from "@/types";
import { useEffect, useRef, useState } from "react";

type DesktopProps = {
  units: UnitWithLessons[];
};

const VocabularyNavigationDesktop = ({ units }: DesktopProps) => {
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowTopFade(scrollTop > 0);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const sections = units.map((u) => document.getElementById(`unit-${u.id}`));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("unit-", "");
            setActiveUnit(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [units]);

  return (
    <aside className="hidden lg:block w-60 self-start sticky top-32">
      <div
        ref={containerRef}
        className="flex flex-col bg-[#FFF9F5] p-4 rounded-2xl border border-[#FFEDE2] shadow-md h-[76.5vh]"
      >
        <h3 className="text-lg font-semibold text-[#6B4C3B] border-b border-[#e8d7cc] pb-2">
          Units
        </h3>
        <div className="flex flex-col space-y-2 mt-2 overflow-y-auto no-scrollbar relative flex-1">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                const el = document.getElementById(`unit-${unit.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`text-left w-full font-medium px-3 py-2 rounded-xl shadow-sm transition hover:cursor-pointer ${
                activeUnit === unit.id
                  ? "bg-[#FFD9C2] text-[#5A3F2C]"
                  : "bg-[#FFEDE2] text-[#6B4C3B] hover:bg-[#FFD9C2]"
              }`}
            >
              {unit.title}
            </button>
          ))}
        </div>
      </div>

      {showTopFade && (
        <div className="pointer-events-none absolute top-14 left-0 right-0 h-8 bg-linear-to-b from-[#FFF9F5] to-transparent" />
      )}

      {showBottomFade && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#FFEDE2] to-transparent" />
      )}
    </aside>
  );
};

export default VocabularyNavigationDesktop;
