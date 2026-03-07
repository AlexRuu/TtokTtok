/*
  Warnings:

  - You are about to drop the column `userStatsId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `userStatsId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `userStatsId` on the `Vocabulary` table. All the data in the column will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_userStatsId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_userStatsId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_userStatsId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "userStatsId";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "userStatsId";

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "userStatsId";

-- DropTable
DROP TABLE "UserStats";

-- CreateTable
CREATE TABLE "UserCompletedLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompletedLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompletedQuiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "completedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompletedQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompletedVocabulary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "completedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompletedVocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCompletedLesson_userId_idx" ON "UserCompletedLesson"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompletedLesson_userId_lessonId_key" ON "UserCompletedLesson"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "UserCompletedQuiz_userId_idx" ON "UserCompletedQuiz"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompletedQuiz_userId_quizId_key" ON "UserCompletedQuiz"("userId", "quizId");

-- CreateIndex
CREATE INDEX "UserCompletedVocabulary_userId_idx" ON "UserCompletedVocabulary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompletedVocabulary_userId_vocabularyId_key" ON "UserCompletedVocabulary"("userId", "vocabularyId");

-- AddForeignKey
ALTER TABLE "UserCompletedLesson" ADD CONSTRAINT "UserCompletedLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedLesson" ADD CONSTRAINT "UserCompletedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedQuiz" ADD CONSTRAINT "UserCompletedQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedQuiz" ADD CONSTRAINT "UserCompletedQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedVocabulary" ADD CONSTRAINT "UserCompletedVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedVocabulary" ADD CONSTRAINT "UserCompletedVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
