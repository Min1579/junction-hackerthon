import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../service/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY } from '../shared/jwtKey';
import { AuthService } from '../shared/auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: JWT_KEY,
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService],
  exports: [UserService],
})
export class UserModule {}
