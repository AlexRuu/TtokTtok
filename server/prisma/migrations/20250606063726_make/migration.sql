-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_vocabularyListId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "vocabularyListId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
