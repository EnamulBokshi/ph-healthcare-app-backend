/*
  Warnings:

  - The primary key for the `specialities` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "specialities" DROP CONSTRAINT "specialities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "specialities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "specialities_id_seq";
