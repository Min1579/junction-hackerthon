import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { UserJoinPayload } from './payload/userJoin.payload';
import { UserLoginPayload } from './payload/userLogin.payload';
import { AuthService } from '../shared/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly _authService: AuthService,
  ) {}

  async join(payload: UserJoinPayload, file) {
    const {
      password,
      passwordCheck,
      role,
      email,
      disabledType,
      name,
      companyName,
      busId,
    } = payload;

    console.log(file);

    if (password !== passwordCheck) {
      throw new BadRequestException('비밀번호가 같지 않습니다!');
    }

    delete payload.passwordCheck;

    if (role === 'COMPANY') {
      await this.prisma.user.create({
        data: {
          email,
          password,
          name,
          role,
          BusDriver: {
            create: {
              companyName,
              Bus: {
                connect: {
                  id: Number(busId),
                },
              },
            },
          },
        },
      });
    } else if (role === 'CLIENT') {
      await this.prisma.user.create({
        data: {
          email,
          password,
          name,
          role,
          disabledType,
          certificate: 'image',
        },
      });
    }
  }

  async login(payload: UserLoginPayload) {
    const { email, password } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        BusDriver: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    } else if (user && password !== user.password) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다');
    }

    const { role, BusDriver } = user;

    const jwt = this._authService.signPayload(
      { userId: user.id, name: user.name ? user.name : '' },
      true,
    );

    return { jwt, role, driverId: BusDriver ? BusDriver.id : null };
  }

  async findUnique(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getUser(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
