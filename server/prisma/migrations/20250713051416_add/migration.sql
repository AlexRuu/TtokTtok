/*
  Warnings:

  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VocabularyList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VocabularyList" ADD COLUMN     "title" TEXT NOT NULL;
