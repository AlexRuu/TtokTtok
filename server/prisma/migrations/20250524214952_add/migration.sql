/*
  Warnings:

  - You are about to drop the column `english` on the `SavedVocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `korean` on the `SavedVocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedVocabulary" DROP COLUMN "english",
DROP COLUMN "korean";

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "korean" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "savedVocabularyId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_savedVocabularyId_fkey" FOREIGN KEY ("savedVocabularyId") REFERENCES "SavedVocabulary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
