import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './service/prisma.service';
import { UserModule } from './user/user.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { SharedModule } from './shared/shared.module';
import { BusModule } from './bus/bus.module';
import { BusdriverModule } from './busdriver/busdriver.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [UserModule, EvaluationModule, SharedModule, BusModule, BusdriverModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
