/*
  Warnings:

  - You are about to drop the column `doctorScheduleId` on the `appointments` table. All the data in the column will be lost.
  - The primary key for the `doctor_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `followUpDate` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the `doctor_specialities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[videoCallingId]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `videoCallingId` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `reportLink` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportName` to the `medical_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_specialityId_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_userId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_doctorId_fkey";

-- DropIndex
DROP INDEX "appointments_doctorScheduleId_key";

-- DropIndex
DROP INDEX "doctor_schedules_doctorId_scheduleId_key";

-- DropIndex
DROP INDEX "medical_reports_appointmentId_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "doctorScheduleId",
ADD COLUMN     "scheduleId" TEXT NOT NULL,
DROP COLUMN "videoCallingId",
ADD COLUMN     "videoCallingId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "appointmentId",
DROP COLUMN "diagnosis",
DROP COLUMN "doctorId",
DROP COLUMN "followUpDate",
DROP COLUMN "treatment",
ADD COLUMN     "reportLink" TEXT NOT NULL,
ADD COLUMN     "reportName" TEXT NOT NULL;

-- DropTable
DROP TABLE "doctor_specialities";

-- DropTable
DROP TABLE "doctors";

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "registrationNumber" TEXT NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "appointmentFee" DOUBLE PRECISION NOT NULL,
    "qualification" TEXT NOT NULL,
    "currentWorkingPlace" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "idx_doctor_isDeleted" ON "doctor"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_specialty_doctorId" ON "doctor_specialties"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_specialty_specialtyId" ON "doctor_specialties"("specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialties_doctorId_specialtyId_key" ON "doctor_specialties"("doctorId", "specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_videoCallingId_key" ON "appointments"("videoCallingId");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");

-- CreateIndex
CREATE INDEX "appointments_scheduleId_idx" ON "appointments"("scheduleId");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "doctor_schedules_doctorId_idx" ON "doctor_schedules"("doctorId");

-- CreateIndex
CREATE INDEX "doctor_schedules_scheduleId_idx" ON "doctor_schedules"("scheduleId");

-- CreateIndex
CREATE INDEX "medical_reports_patientId_idx" ON "medical_reports"("patientId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
