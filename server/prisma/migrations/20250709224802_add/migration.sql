/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
