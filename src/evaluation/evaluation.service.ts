import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { EvaluationCreatePayload } from './payload/evaluation.create.payload';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluateDriver(
    userId: number,
    busId: number,
    payload: EvaluationCreatePayload,
  ) {
    const { point, speedPoint, kindPoint, memo } = payload;

    const busDriver = await this.prisma.busDriver.findFirst({
      where: {
        Bus: {
          id: busId,
        },
      },
    });

    await this.prisma.driverEvaluation.create({
      data: {
        point: point ? Number(point) : null,
        speedPoint: speedPoint ? Number(speedPoint) : null,
        kindPoint: kindPoint ? Number(kindPoint) : null,
        memo: memo ? memo : null,
        BusDriver: {
          connect: {
            id: busDriver.id,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    try {
      await this.prisma.passenger.delete({
        where: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          Passenger_userId_busdriverId_unique_constraint: {
            userId,
            busdriverId: busDriver.id,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}
