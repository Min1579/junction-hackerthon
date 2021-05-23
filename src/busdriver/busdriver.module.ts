import { Module } from '@nestjs/common';
import { BusdriverController } from './busdriver.controller';
import { BusdriverService } from './busdriver.service';
import { PrismaService } from '../service/prisma.service';

@Module({
  controllers: [BusdriverController],
  providers: [BusdriverService, PrismaService],
})
export class BusdriverModule {}
