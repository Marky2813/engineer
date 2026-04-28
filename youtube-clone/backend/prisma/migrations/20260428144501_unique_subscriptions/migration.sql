/*
  Warnings:

  - A unique constraint covering the columns `[subscribedById,subscribedToId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscribedById_subscribedToId_key" ON "Subscription"("subscribedById", "subscribedToId");
