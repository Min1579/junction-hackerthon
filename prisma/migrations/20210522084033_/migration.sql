-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusAndStation" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "busId" INTEGER NOT NULL,
    "nextId" INTEGER,
    "prevId" INTEGER,
    "startPoint" BOOLEAN NOT NULL,
    "endPoint" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusAndStation_busId_stationId_unique_constraint" ON "BusAndStation"("busId", "stationId");

-- AddForeignKey
ALTER TABLE "BusAndStation" ADD FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusAndStation" ADD FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
