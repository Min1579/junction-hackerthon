import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../service/prisma.service';

describe('BusService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('Bus Moving', async () => {
    const busStatuses = await prisma.busAndStation.findMany({
      where: {
        MovingBus: {
          isNot: null,
        },
      },
      include: {
        MovingBus: true,
      },
    });

    for await (const status of busStatuses) {
      const { nextId, MovingBus } = status;
      console.log(MovingBus);

      await prisma.movingBus.delete({
        where: {
          id: MovingBus.id,
        },
      });

      await prisma.busAndStation.update({
        where: {
          id: nextId,
        },
        data: {
          MovingBus: {
            create: {
              ...MovingBus,
            },
          },
        },
      });
    }
  });
});
