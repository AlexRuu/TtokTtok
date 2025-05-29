/*
  Warnings:

  - You are about to drop the `_LessonToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LessonToTag" DROP CONSTRAINT "_LessonToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToTag" DROP CONSTRAINT "_LessonToTag_B_fkey";

-- DropTable
DROP TABLE "_LessonToTag";

-- CreateTable
CREATE TABLE "Tagging" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "lessonId" TEXT,
    "quizId" TEXT,
    "vocabularyId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tagging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tagging_tagId_idx" ON "Tagging"("tagId");

-- CreateIndex
CREATE INDEX "Tagging_lessonId_idx" ON "Tagging"("lessonId");

-- CreateIndex
CREATE INDEX "Tagging_quizId_idx" ON "Tagging"("quizId");

-- CreateIndex
CREATE INDEX "Tagging_vocabularyId_idx" ON "Tagging"("vocabularyId");

-- CreateIndex
CREATE INDEX "LessonVersion_lessonId_idx" ON "LessonVersion"("lessonId");

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
