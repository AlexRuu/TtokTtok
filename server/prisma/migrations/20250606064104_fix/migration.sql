/*
  Warnings:

  - You are about to drop the column `vocabularyListId` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lessonId]` on the table `VocabularyList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lessonId` to the `VocabularyList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_vocabularyListId_fkey";

-- DropIndex
DROP INDEX "Lesson_vocabularyListId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "vocabularyListId";

-- AlterTable
ALTER TABLE "VocabularyList" ADD COLUMN     "lessonId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyList_lessonId_key" ON "VocabularyList"("lessonId");

-- AddForeignKey
ALTER TABLE "VocabularyList" ADD CONSTRAINT "VocabularyList_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
