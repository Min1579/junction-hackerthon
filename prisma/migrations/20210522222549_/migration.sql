-- CreateEnum
CREATE TYPE "PassengerStatus" AS ENUM ('BOARDING', 'GETOFF');

-- AlterTable
ALTER TABLE "Passenger" ADD COLUMN     "stationId" INTEGER,
ADD COLUMN     "status" "PassengerStatus" NOT NULL DEFAULT E'BOARDING';

-- AddForeignKey
ALTER TABLE "Passenger" ADD FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;
