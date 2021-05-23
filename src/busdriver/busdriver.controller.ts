import { Controller, Get, UseGuards } from '@nestjs/common';
import { BusdriverService } from './busdriver.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/currentUser.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('운전기사')
@Controller('busdriver')
export class BusdriverController {
  constructor(private readonly service: BusdriverService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getDriverBoard(@CurrentUser() user) {
    return this.service.getDriverBoard(user.id);
  }
}
