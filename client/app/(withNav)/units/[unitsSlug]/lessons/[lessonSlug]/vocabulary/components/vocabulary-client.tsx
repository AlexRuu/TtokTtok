"use client";

import { VocabularyList } from "@/types";
import { useEffect, useState } from "react";
import StudySession from "./study-session";
import VocabModeToggle from "./vocabulary-mode-toggle";
import VocabularyGrid from "./vocabulary-grid";
import { useSession } from "next-auth/react";
import { getSavedVocab } from "@/actions/get-saved-vocabulary";
import useLoading from "@/hooks/use-loading";
import Loader from "@/components/ui/loader";

interface VocabularyProps {
  vocabularyList: VocabularyList;
}

const VocabularyClient = ({ vocabularyList }: VocabularyProps) => {
  const [mode, setMode] = useState<"review" | "study">("review");
  const { data: session } = useSession();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchSavedVocab = async () => {
      startLoading();
      try {
        const initialData = await getSavedVocab();
        setSavedIds(initialData?.savedIds || []);
      } catch (error) {
        setSavedIds([]);
      } finally {
        stopLoading();
      }
    };

    fetchSavedVocab();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto mt-10 max-w-3xl min-h-screen rounded-2xl bg-[#FFF9F5] px-6 py-8 text-[#6B4C3B] shadow-sm">
      <header className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {vocabularyList.title}
        </h1>
        <p className="text-sm font-light tracking-tight">
          Unit {vocabularyList.lesson.unit.unitNumber} -{" "}
          {vocabularyList.lesson.title}
        </p>
        <VocabModeToggle mode={mode} onChange={setMode} />

        {mode === "study" && (
          <p className="text-xs text-[#8A6B5A] mb-3">
            Focus on a few words at a time
          </p>
        )}
      </header>

      {mode === "review" && savedIds !== null && (
        <VocabularyGrid
          vocabulary={vocabularyList.vocabulary}
          savedIds={savedIds}
          setSavedIds={setSavedIds}
          loggedIn={!!session?.user}
        />
      )}

      {mode === "study" && (
        <div className="w-full max-w-2xl mx-auto">
          <StudySession vocabulary={vocabularyList.vocabulary} />
        </div>
      )}
    </div>
  );
};

export default VocabularyClient;
