import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.model';
import { JWT_KEY } from './jwtKey';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
  ) {
    this.jwtOptions = { expiresIn: '1y' };
    this.jwtKey = JWT_KEY;
  }

  signPayload(payload: JwtPayload, isPermenant: boolean): string {
    return sign(
      payload,
      this.jwtKey,
      isPermenant ? { expiresIn: '100y' } : this.jwtOptions,
    );
  }

  async validateUser(validatePayload: JwtPayload): Promise<User | null> {
    return this._userService.findUnique(validatePayload.userId);
  }
}
