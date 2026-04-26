/*
  Warnings:

  - A unique constraint covering the columns `[channelName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_channelName_key" ON "User"("channelName");
