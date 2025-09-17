"use client";

import React, { useEffect, useState } from "react";
import Xarrow from "react-xarrows";
import { QuizQuestion } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface MatchingQuizProps {
  question: QuizQuestion & {
    options: { left: string; right: string }[];
  };
  disabled?: boolean;
  onChange?: (matches: Record<string, string>) => void;
  value?: Record<string, string>;
}

const MatchingQuiz: React.FC<MatchingQuizProps> = ({
  question,
  disabled,
  onChange,
  value,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    if (value) {
      setMatches(value);
    }
  }, [value]);

  const handleLeftClick = (left: string) => {
    if (disabled) return;
    // Deselect if already selected
    setSelectedLeft(selectedLeft === left ? null : left);
  };

  const handleRightClick = (right: string) => {
    if (disabled || !selectedLeft) return;

    const updatedMatches = { ...matches };

    // Remove any left that was previously matched to this right
    for (const [l, r] of Object.entries(updatedMatches)) {
      if (r === right) {
        delete updatedMatches[l];
        break;
      }
    }

    // Remove previous match of selected left if exists
    if (updatedMatches[selectedLeft]) {
      delete updatedMatches[selectedLeft];
    }

    // Assign new match
    updatedMatches[selectedLeft] = right;

    setMatches(updatedMatches);
    setSelectedLeft(null);

    onChange?.(updatedMatches);
  };

  return (
    <div className="relative flex w-full justify-center">
      {/* Inner wrapper keeps left + right centered with spacing */}
      <div className="flex flex-row gap-24">
        {/* Left Column */}
        <div className="flex flex-col gap-3 w-[180px] items-end">
          {question.options.map((opt) => {
            const isSelected = selectedLeft === opt.left;
            const isMatched = matches[opt.left] !== undefined;

            return (
              <Card
                key={opt.left}
                id={`left-${opt.left}`}
                className={`p-3 cursor-pointer w-full ${
                  isSelected
                    ? "border-[#5A3F2C] bg-[#FFF2E6]"
                    : isMatched
                    ? "opacity-50"
                    : "bg-white"
                }`}
                onClick={() => handleLeftClick(opt.left)}
              >
                <CardContent>{opt.left}</CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 w-[180px] items-start">
          {question.options.map((opt) => {
            const isMatched = Object.values(matches).includes(opt.right);

            return (
              <Card
                key={opt.right}
                id={`right-${opt.right}`}
                className={`p-3 cursor-pointer w-full ${
                  isMatched ? "opacity-50 bg-[#FFF8F3]" : "bg-white"
                }`}
                onClick={() => handleRightClick(opt.right)}
              >
                <CardContent>{opt.right}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(matches).map(([left, right]) => (
          <Xarrow
            key={left}
            start={`left-${left}`}
            end={`right-${right}`}
            color="#FFB899"
            strokeWidth={3}
            headSize={6}
            curveness={0.5}
            startAnchor="right"
            endAnchor="left"
          />
        ))}
      </div>
    </div>
  );
};

export default MatchingQuiz;
