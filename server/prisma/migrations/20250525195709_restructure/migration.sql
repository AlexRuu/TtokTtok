/*
  Warnings:

  - You are about to drop the column `config` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `savedVocabularyId` on the `Vocabulary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,vocabularyId]` on the table `SavedVocabulary` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `content` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `vocabularyId` to the `SavedVocabulary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_savedVocabularyId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "styleVariant" TEXT,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "config",
ALTER COLUMN "answer" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SavedVocabulary" ADD COLUMN     "vocabularyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "savedVocabularyId";

-- CreateTable
CREATE TABLE "LessonVersion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonMedia" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonVersion_lessonId_version_key" ON "LessonVersion"("lessonId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SavedVocabulary_userId_vocabularyId_key" ON "SavedVocabulary"("userId", "vocabularyId");

-- AddForeignKey
ALTER TABLE "SavedVocabulary" ADD CONSTRAINT "SavedVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonVersion" ADD CONSTRAINT "LessonVersion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
