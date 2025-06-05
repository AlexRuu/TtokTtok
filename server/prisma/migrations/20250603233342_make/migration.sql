/*
  Warnings:

  - Made the column `borderColour` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "borderColour" SET NOT NULL;
