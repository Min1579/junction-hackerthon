/*
  Warnings:

  - Added the required column `companyName` to the `BusDriver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusDriver" ADD COLUMN     "companyName" TEXT NOT NULL;
