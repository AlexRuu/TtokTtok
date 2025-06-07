/*
  Warnings:

  - Made the column `vocabularyListId` on table `Vocabulary` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_vocabularyListId_fkey";

-- AlterTable
ALTER TABLE "Vocabulary" ALTER COLUMN "vocabularyListId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
