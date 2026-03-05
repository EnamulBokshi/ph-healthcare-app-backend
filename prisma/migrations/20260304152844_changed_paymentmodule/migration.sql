/*
  Warnings:

  - You are about to drop the `specialities` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `transactionId` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialtyId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "transactionId" UUID NOT NULL;

-- DropTable
DROP TABLE "specialities";

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialties_title_key" ON "specialties"("title");

-- CreateIndex
CREATE INDEX "idx_specialty_isDeleted" ON "specialties"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_specialty_title" ON "specialties"("title");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
