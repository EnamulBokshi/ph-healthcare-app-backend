/*
  Warnings:

  - A unique constraint covering the columns `[stripeEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeEventId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stripeEventId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");
