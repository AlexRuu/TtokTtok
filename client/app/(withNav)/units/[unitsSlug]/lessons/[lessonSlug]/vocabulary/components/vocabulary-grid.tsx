import { Vocabulary } from "@/types";
import SaveVocabButton from "./save-vocabulary";

interface Props {
  vocabulary: Vocabulary[];
  savedIds: string[];
  setSavedIds: (ids: string[]) => void;
  loggedIn: boolean;
}

const VocabularyGrid = ({
  vocabulary,
  savedIds = [],
  loggedIn,
  setSavedIds,
}: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {vocabulary.map((vocab) => {
        const isSaved = savedIds.includes(vocab.id);

        return (
          <div
            key={vocab.id}
            className="
              relative        
              rounded-xl
              border border-[#F2E6DF]
              bg-white
              px-6 py-6
              shadow-sm
              hover:shadow-md
              transition-all
              duration-200
              hover:scale-105
              flex
              flex-col
              items-center
              justify-center
              text-center
              min-h-[120px]
            "
          >
            {loggedIn === true && (
              <div className="absolute top-3 right-3">
                <SaveVocabButton
                  vocabularyId={vocab.id}
                  initiallySaved={isSaved}
                  savedIds={savedIds}
                  setSavedIds={setSavedIds}
                />
              </div>
            )}

            <p className="text-lg font-semibold text-[#6B4C3B] wrap-break-word">
              {vocab.korean}
            </p>
            <p className="text-sm text-[#8A6B5A] mt-2 wrap-break-word">
              {vocab.english}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default VocabularyGrid;
