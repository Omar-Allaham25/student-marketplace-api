/*
  Warnings:

  - A unique constraint covering the columns `[verifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UpdatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifyToken" TEXT,
ADD COLUMN     "verifyTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "User"("verifyToken");
