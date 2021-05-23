/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DisabledType" AS ENUM ('WHEELCHAIR', 'BLIND');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANY', 'CLINET');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "certificate" TEXT,
ADD COLUMN     "role" "Role" NOT NULL;
