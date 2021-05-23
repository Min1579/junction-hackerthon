import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserJoinPayload } from './payload/userJoin.payload';
import { UserLoginPayload } from './payload/userLogin.payload';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../shared/currentUser.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('join')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  async join(@Body() payload: UserJoinPayload, @UploadedFiles() file) {
    return this.service.join(payload, file);
  }

  @Post('login')
  async login(@Body() payload: UserLoginPayload) {
    return this.service.login(payload);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getUser(@CurrentUser() user) {
    console.log(user);
    return this.service.getUser(user.id);
  }
}
