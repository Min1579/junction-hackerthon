/*
  Warnings:

  - A unique constraint covering the columns `[busId]` on the table `BusDriver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "MovingBus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "busDriverId" INTEGER NOT NULL,
    "busAndStationId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovingBus_busAndStationId_unique" ON "MovingBus"("busAndStationId");

-- CreateIndex
CREATE UNIQUE INDEX "BusDriver_busId_unique" ON "BusDriver"("busId");

-- AddForeignKey
ALTER TABLE "MovingBus" ADD FOREIGN KEY ("busDriverId") REFERENCES "BusDriver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovingBus" ADD FOREIGN KEY ("busAndStationId") REFERENCES "BusAndStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
