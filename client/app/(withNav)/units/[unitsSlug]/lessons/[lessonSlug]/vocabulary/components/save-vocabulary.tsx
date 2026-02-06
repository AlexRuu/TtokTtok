"use client";

import {
  deleteSavedVocab,
  postSavedVocab,
} from "@/actions/post-delete-saved-vocab";
import useLoading from "@/hooks/use-loading";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

interface Props {
  vocabularyId: string;
  initiallySaved?: boolean;
  savedIds: string[];
  setSavedIds: (ids: string[]) => void;
}

const SaveVocabButton = ({ vocabularyId, savedIds, setSavedIds }: Props) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const isSaved = savedIds.includes(vocabularyId);

  const toggleSave = async () => {
    if (isLoading) return;
    startLoading();

    try {
      const res = isSaved
        ? await deleteSavedVocab(vocabularyId)
        : await postSavedVocab(vocabularyId);

      if (res?.ok) {
        setSavedIds(
          isSaved
            ? savedIds.filter((id) => id !== vocabularyId)
            : [...savedIds, vocabularyId],
        );
      }
    } catch (error) {
      console.error("Error toggling saved vocab", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <motion.button
      onClick={toggleSave}
      disabled={isLoading}
      whileTap={{ scale: 0.9 }}
      animate={{
        opacity: isLoading ? 0.5 : 1,
      }}
      transition={{ duration: 0.15 }}
      className={`
        flex items-center justify-center
        w-8 h-8 rounded-full
        border transition-colors
        ${
          isSaved
            ? "bg-[#FFF0E6] border-[#FFD7C2]"
            : "bg-[#FFF9F5] border-[#F2E6DF] hover:bg-[#FFF0E6]"
        }
      `}
      aria-label={isSaved ? "Unsave vocabulary" : "Save vocabulary"}
    >
      <motion.div
        animate={{ scale: isLoading ? 0.85 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <Bookmark
          className={`
            w-4 h-4 hover:cursor-pointer
            ${isSaved ? "fill-[#8A6B5A] text-[#8A6B5A]" : "text-[#B89B8C]"}
          `}
        />
      </motion.div>
    </motion.button>
  );
};

export default SaveVocabButton;
