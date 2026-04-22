/*
  Warnings:

  - Added the required column `thumbnail` to the `Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "description" TEXT,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
