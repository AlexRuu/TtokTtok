/*
  Warnings:

  - Made the column `backgroundColour` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `textColour` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "backgroundColour" SET NOT NULL,
ALTER COLUMN "textColour" SET NOT NULL;
