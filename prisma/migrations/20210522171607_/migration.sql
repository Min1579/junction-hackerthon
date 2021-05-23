/*
  Warnings:

  - You are about to drop the column `boardingTime` on the `CustomerHistroy` table. All the data in the column will be lost.
  - You are about to drop the column `dropOffTime` on the `CustomerHistroy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerHistroy" DROP COLUMN "boardingTime",
DROP COLUMN "dropOffTime";

-- CreateTable
CREATE TABLE "Passenger" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "busdriverId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_userId_busdriverId_unique_constraint" ON "Passenger"("userId", "busdriverId");

-- AddForeignKey
ALTER TABLE "Passenger" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger" ADD FOREIGN KEY ("busdriverId") REFERENCES "BusDriver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
