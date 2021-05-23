-- CreateTable
CREATE TABLE "BusDriver" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "busId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverEvaluation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "point" INTEGER,
    "speedPoint" INTEGER,
    "kindPoint" INTEGER,
    "memo" TEXT,
    "busDriverId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerHistroy" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardingTime" TIMESTAMP(3),
    "dropOffTime" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusDriver_userId_busId_unique_constraint" ON "BusDriver"("userId", "busId");

-- CreateIndex
CREATE UNIQUE INDEX "BusDriver_userId_unique" ON "BusDriver"("userId");

-- AddForeignKey
ALTER TABLE "BusDriver" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusDriver" ADD FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverEvaluation" ADD FOREIGN KEY ("busDriverId") REFERENCES "BusDriver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
