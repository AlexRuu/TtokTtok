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

      <main className="flex-1 bg-[#FFF9F5] text-[#6B4C3B] rounded-2xl shadow-md p-8 space-y-12">
        <h1 className="text-3xl font-bold text-[#6B4C3B] mb-6">Vocabulary</h1>
        <VocabularyDisplay vocabularyList={vocabularyList} />
      </main>
    </div>
  );
};

export default VocabularyPage;
