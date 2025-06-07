/*
  Warnings:

  - You are about to drop the column `lessonId` on the `VocabularyList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vocabularyListId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vocabularyListId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_unitId_fkey";

-- DropForeignKey
ALTER TABLE "LessonVersion" DROP CONSTRAINT "LessonVersion_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "SavedVocabulary" DROP CONSTRAINT "SavedVocabulary_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedVocabulary" DROP CONSTRAINT "SavedVocabulary_vocabularyId_fkey";

-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_vocabularyListId_fkey";

-- DropForeignKey
ALTER TABLE "UserChapterReview" DROP CONSTRAINT "UserChapterReview_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserChapterReview" DROP CONSTRAINT "UserChapterReview_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UserChapterReview" DROP CONSTRAINT "UserChapterReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAttempt" DROP CONSTRAINT "UserQuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAttempt" DROP CONSTRAINT "UserQuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_vocabularyListId_fkey";

-- DropForeignKey
ALTER TABLE "VocabularyList" DROP CONSTRAINT "VocabularyList_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "vocabularyListId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VocabularyList" DROP COLUMN "lessonId";

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_vocabularyListId_key" ON "Lesson"("vocabularyListId");

-- AddForeignKey
ALTER TABLE "SavedVocabulary" ADD CONSTRAINT "SavedVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedVocabulary" ADD CONSTRAINT "SavedVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapterReview" ADD CONSTRAINT "UserChapterReview_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapterReview" ADD CONSTRAINT "UserChapterReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapterReview" ADD CONSTRAINT "UserChapterReview_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAttempt" ADD CONSTRAINT "UserQuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizAttempt" ADD CONSTRAINT "UserQuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonVersion" ADD CONSTRAINT "LessonVersion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_vocabularyListId_fkey" FOREIGN KEY ("vocabularyListId") REFERENCES "VocabularyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
