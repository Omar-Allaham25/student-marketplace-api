/*
  Warnings:

  - You are about to drop the column `isVerifide` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerifide",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
