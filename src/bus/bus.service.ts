import { Injectable, NotFoundException } from '@nestjs/common';
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

    const mappers: any[] = [];

    for await (const s of statuses) {
      const { id, name } = s.Bus;

      const mvb = await this.prisma.movingBus.findFirst({
        where: {
          BusAndStation: {
            busId: id,
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

      let leftStation;
      if (mvb && mvb.BusAndStation) {
        leftStation = Math.abs(mvb.BusAndStation.stationId - s.Station.id);
      } else {
        leftStation = 30;
      }
      const leftMin = leftStation * 2;

      mappers.push({
        id,
        name,
        stationId: s.Station.id,
        leftMin,
        leftStation,
      });
    }

    // return statuses.map((s) => {
    //   const { id, name } = s.Bus;
    //   return {
    //     id,
    //     name,
    //     stationId: s.Station.id,
    //     // leftMin,
    //     // leftStation: ,
    //   };
    // });

    return mappers;
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
    console.log('busId : ', busId);
    const busDriver = await this.prisma.busDriver.findUnique({
      where: {
        busId,
      },
    });

    if (!busDriver) {
      throw new NotFoundException('운전자를 찾을 수 없습니다');
    }

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
      name: s.name,
      disabledType: u.disabledType,
      type: '승차',
      driverId: 6, //busDriver.id,
    };
    this.socket.broadcast(JSON.stringify(data), JSON.stringify(data));
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
      name: s.name,
      disabledType: u.disabledType,
      type: '하차',
      driverId: 6, //busDriver.id,
    };
    this.socket.broadcast(JSON.stringify(data), JSON.stringify(data));
  }

  @Cron('3 * * * * *')
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
