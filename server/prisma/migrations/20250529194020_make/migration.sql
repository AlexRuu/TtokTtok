/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_lessonId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "lessonId";

-- CreateTable
CREATE TABLE "_LessonToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LessonToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LessonToTag_B_index" ON "_LessonToTag"("B");

-- AddForeignKey
ALTER TABLE "_LessonToTag" ADD CONSTRAINT "_LessonToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTag" ADD CONSTRAINT "_LessonToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
