import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class BusdriverService {
  constructor(private readonly prisma: PrismaService) {}

  async getDriverBoard(userId: number) {
    const driver = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        BusDriver: {
          select: {
            id: true,
            Passengers: {
              select: {
                status: true,
                Station: {
                  select: {
                    id: true,
                  },
                },
                User: {
                  select: {
                    disabledType: true,
                  },
                },
              },
            },
            Bus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('운전자를 찾을 수 없습니다');
    }

    console.log('driver : ', driver);
    const busId = driver.BusDriver.Bus.id;

    const mvb = await this.prisma.movingBus.findFirst({
      where: {
        BusAndStation: {
          busId,
        },
      },
      select: {
        BusAndStation: {
          select: {
            stationId: true,
          },
        },
      },
    });

    const routes = await this.prisma.busAndStation.findMany({
      where: {
        busId,
      },
      select: {
        id: true,
        Station: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    console.log('routes : ', routes);

    const mappers: any[] = [];

    for await (const route of routes) {
      const { id, name } = route.Station;

      mappers.push({
        id,
        name,
        currentLocation:
          mvb.BusAndStation && id === mvb.BusAndStation?.stationId
            ? true
            : false,
        blindOn: driver.BusDriver.Passengers.filter(
          (p) =>
            p.User.disabledType === 'BLIND' &&
            p.Station.id === id &&
            p.status === 'BOARDING',
        ).length,
        blindOff: driver.BusDriver.Passengers.filter(
          (p) =>
            p.User.disabledType === 'BLIND' &&
            p.Station.id === id &&
            p.status === 'GETOFF',
        ).length,
        wheelchairOn: driver.BusDriver.Passengers.filter(
          (p) =>
            p.User.disabledType === 'WHEELCHAIR' &&
            p.Station.id === id &&
            p.status === 'BOARDING',
        ).length,
        wheelchairOff: driver.BusDriver.Passengers.filter(
          (p) =>
            p.User.disabledType === 'WHEELCHAIR' &&
            p.Station.id === id &&
            p.status === 'GETOFF',
        ).length,
      });
    }

    mappers[0].blindOn = 1;
    mappers[1].wheelchairOff = 1;
    mappers[3].blindOff = 1;
    return mappers;
  }
}
