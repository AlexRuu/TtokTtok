/*
  Warnings:

  - You are about to drop the column `vocabularyId` on the `Tagging` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_vocabularyId_fkey";

-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_lessonId_fkey";

-- DropIndex
DROP INDEX "Tagging_vocabularyId_idx";

-- AlterTable
ALTER TABLE "Tagging" DROP COLUMN "vocabularyId",
ADD COLUMN     "vocabularyListId" TEXT;

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "lessonId",
ADD COLUMN     "vocabularyListId" TEXT;

-- CreateTable
CREATE TABLE "VocabularyList" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VocabularyList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tagging_vocabularyListId_idx" ON "Tagging"("vocabularyListId");

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyList" ADD CONSTRAINT "VocabularyList_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
