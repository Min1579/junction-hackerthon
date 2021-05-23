import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { Cron } from '@nestjs/schedule';
import { EventsGateway } from '../websocket/event.gateway';

@Injectable()
export class BusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socket: EventsGateway,
  ) {}

  async findBusStation(queryString: string) {
    return this.prisma.station.findMany({
      skip: 0,
      take: 10,
      where: {
        name: {
          contains: queryString,
        },
      },
    });
  }

  async findBuses(stationName: string): Promise<any[]> {
    const statuses = await this.prisma.busAndStation.findMany({
      skip: 0,
      take: 10,
      where: {
        Station: {
          name: {
            contains: stationName,
          },
        },
      },
      select: {
        id: true,
        nextId: true,
        Station: {
          select: {
            id: true,
          },
        },
        Bus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return statuses.map((s) => {
      const leftMin = Math.trunc(Math.random() * 10) + 5;
      const { id, name } = s.Bus;
      return {
        id,
        name,
        stationId: s.Station.id,
        leftMin,
        leftStation: Math.floor(leftMin / 3),
      };
    });
  }

  async getBusRouteMap(userId: number, busId: number) {
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
        id: 'desc',
      },
    });

    return routes.map((route) => {
      const { id, name } = route.Station;

      return {
        id,
        name,
        currentLocation: id === mvb.BusAndStation.stationId ? true : false,
      };
    });
  }

  async getOnTheBus(userId: number, busId: number, stationId: number) {
    const busDriver = await this.prisma.busDriver.findFirst({
      where: {
        Bus: {
          id: busId,
        },
      },
    });

    try {
      await this.prisma.passenger.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
          BusDriver: {
            connect: {
              id: busDriver.id,
            },
          },
          Station: {
            connect: {
              id: stationId,
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
    }

    const u = await this.getUser(userId);
    const s = await this.getStation(stationId);
    const data = {
      text: `${s.name!} 정류장에서 ${
        u.disabledType === 'BLIND' ? '시각장애인' : '휠체어 이용자'
      } 1분이 승차하십니다`,
      driverId: busDriver.id,
    };
    this.socket.broadcast(JSON.stringify(data));
  }

  async getOffTheBus(userId: number, busId: number, stationId: number) {
    await this.prisma.movingBus.findFirst({
      where: {
        BusAndStation: {
          busId,
        },
      },
      select: {
        BusAndStation: {
          select: {
            nextId: true,
          },
        },
      },
    });

    const busDriver = await this.prisma.busDriver.findFirst({
      where: {
        Bus: {
          id: busId,
        },
      },
    });

    try {
      await this.prisma.passenger.update({
        where: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          Passenger_userId_busdriverId_unique_constraint: {
            userId,
            busdriverId: busDriver.id,
          },
        },
        data: {
          status: 'GETOFF',
        },
      });
    } catch (error) {
      console.error(error);
    }

    const u = await this.getUser(userId);
    const s = await this.getStation(stationId);
    const data = {
      text: `${s.name!} 정류장에서 ${
        u.disabledType === 'BLIND' ? '시각장애인' : '휠체어 이용자'
      } 1분이 하차하십니다`,
      driverId: busDriver.id,
    };
    this.socket.broadcast(JSON.stringify(data));
  }

  @Cron('1 * * * * *')
  async iterateBusStation() {
    const busStatuses = await this.prisma.busAndStation.findMany({
      include: {
        MovingBus: true,
      },
    });

    for await (const status of busStatuses) {
      if (status.MovingBus) {
        const { nextId, MovingBus } = status;

        const id = MovingBus.busDriverId;
        await this.prisma.movingBus.delete({
          where: {
            id: MovingBus.id,
          },
        });

        await this.prisma.busAndStation.update({
          where: {
            id: nextId,
          },
          data: {
            MovingBus: {
              create: {
                BusDriver: {
                  connect: {
                    id,
                  },
                },
              },
            },
          },
        });
      }
    }
  }

  private async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        disabledType: true,
      },
    });
  }

  private async getStation(id: number) {
    return this.prisma.station.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });
  }
}
