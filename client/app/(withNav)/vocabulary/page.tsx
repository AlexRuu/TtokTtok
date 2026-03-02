import { Metadata } from "next";

import getVocabularyList from "@/actions/get-vocab-list";
import VocabularyDisplay from "./components/vocab-display";
import VocabularyNavigationDesktop from "./components/vocab-desktop";
import getUnits from "@/actions/get-units";
import VocabularyNavigationMobile from "./components/vocab-mobile";

export const metadata: Metadata = {
  title: "Vocabulary",
  description: "TtokTtok Vocabulary",
};

const VocabularyPage = async () => {
  const vocabularyList = await getVocabularyList();
  const units = await getUnits();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Desktop navigation sidebar */}
      <VocabularyNavigationDesktop units={units} />

      {/* Mobile navigation menu */}
      <VocabularyNavigationMobile units={units} />

      <main className="flex-1 bg-[#FFF9F5] text-[#6B4C3B] rounded-3xl border border-[#F3E4DA] p-8 space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#5A3F2C]">
          Vocabulary
        </h1>
        <p className="text-sm text-[#9C7B6A] -mt-6 border-b pb-2 border-[#e8d7cc]">
          Browse vocabulary by unit and lesson.
        </p>

        <VocabularyDisplay vocabularyList={vocabularyList} />
      </main>
    </div>
  );
};

export default VocabularyPage;
