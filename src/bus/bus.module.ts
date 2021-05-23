import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { PrismaService } from '../service/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import {EventsGateway} from "../websocket/event.gateway";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BusController],
  providers: [BusService, PrismaService, EventsGateway],
})
export class BusModule {}
