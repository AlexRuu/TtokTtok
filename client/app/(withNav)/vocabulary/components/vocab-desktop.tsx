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

  return (
    <aside className="hidden lg:block w-60 self-start sticky top-32">
      <div className="flex flex-col bg-[#FFF9F5] p-4 rounded-2xl border border-[#FFEDE2] shadow-md h-[76.5vh]">
        <h3 className="text-lg font-semibold text-[#6B4C3B] border-b border-[#e8d7cc] pb-2">
          Units
        </h3>
        <div className="flex flex-col space-y-2 mt-2 overflow-y-scroll no-scrollbar relative h-[80vh]">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                const el = document.getElementById(`unit-${unit.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-left w-full font-medium text-[#6B4C3B] px-3 py-2 rounded-xl bg-[#FFEDE2] hover:bg-[#FFD9C2] shadow-sm hover:shadow-md transition hover:cursor-pointer"
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
