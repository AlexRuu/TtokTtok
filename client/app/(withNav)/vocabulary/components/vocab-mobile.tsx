"use client";

import { UnitWithLessons } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type MobileProps = {
  units: UnitWithLessons[];
};

const VocabularyNavigationMobile = ({ units }: MobileProps) => {
  return (
    <div className="lg:hidden w-full mb-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full rounded-xl bg-[#FFEDE2] text-[#6B4C3B] font-medium py-2 shadow-md hover:bg-[#FFD9C2] transition">
            Browse Units
          </Button>
        </DrawerTrigger>

        <DrawerContent className="bg-[#FFF9F5] rounded-t-2xl shadow-xl">
          <div className="w-12 h-1.5 bg-[#FFD9C2] rounded-full mx-auto mt-2 mb-4" />
          <DrawerHeader>
            <DrawerTitle className="text-[#6B4C3B]">Units</DrawerTitle>
          </DrawerHeader>

          <div className="grid gap-3 px-6 pb-6">
            {units.map((unit) => (
              <DrawerClose asChild key={unit.id}>
                <button
                  onClick={() => {
                    const el = document.getElementById(`unit-${unit.id}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-[#FFEDE2] text-[#6B4C3B] hover:bg-[#FFD9C2] transition font-medium shadow-sm"
                >
                  {unit.title}
                </button>
              </DrawerClose>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default VocabularyNavigationMobile;
