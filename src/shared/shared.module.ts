import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  imports: [UserModule],
})
export class SharedModule {}
