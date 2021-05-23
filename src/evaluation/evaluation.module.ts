import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { PrismaService } from '../service/prisma.service';
import { EventsGateway } from '../websocket/event.gateway';

@Module({
  providers: [EvaluationService, PrismaService, EventsGateway],
  controllers: [EvaluationController],
})
export class EvaluationModule {}
