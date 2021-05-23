import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  const swaggerOptions = new DocumentBuilder()
    .setTitle('API Swagger')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .addServer('http://')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('', app, swaggerDoc, {
    swaggerUrl: '/api/docs-json',
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(express.static(join(process.cwd(), '../client/dist/')));

  await app.listen(3000);
}
bootstrap();
