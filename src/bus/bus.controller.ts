import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BusService } from './bus.service';
import { CurrentUser } from '../shared/currentUser.decorator';

@ApiTags('버스')
@Controller('bus')
export class BusController {
  constructor(private readonly service: BusService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findBuses(@Query('stationName') stationName: string) {
    return this.service.findBuses(stationName);
  }

  @Get('station')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findBusStation(@Query('queryString') queryString: string) {
    return this.service.findBusStation(queryString);
  }

  @Get('location/:busId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getBusRouteMap(
    @CurrentUser() user,
    @Param('busId', ParseIntPipe) busId: number,
  ) {
    return this.service.getBusRouteMap(user.id, busId);
  }

  @Post(':busId/:stationId/getOn')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getOnTheBus(
    @Param('busId', ParseIntPipe) busId: number,
    @Param('stationId', ParseIntPipe) stationId: number,
    @CurrentUser() user,
  ) {
    return this.service.getOnTheBus(user.id, busId, stationId);
  }

  @Delete(':busId/:stationId/getOff')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getOffTheBus(
    @Param('busId', ParseIntPipe) busId: number,
    @Param('stationId', ParseIntPipe) stationId: number,
    @CurrentUser() user,
  ) {
    return this.service.getOffTheBus(user.id, busId, stationId);
  }
}
