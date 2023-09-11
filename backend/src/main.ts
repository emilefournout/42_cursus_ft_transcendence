import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import * as fs from 'fs';
import { WSValidationPipe } from './pipes/ws-validation.pipe';
import { ExtendedSocketIoAdapter } from './ExtendedIoAdapter';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./certification/key.pem'),
    cert: fs.readFileSync('./certification/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new WSValidationPipe()
  );
  app.use(json({ limit: '50mb' }));
  // app.useWebSocketAdapter(new ExtendedSocketIoAdapter(app.getHttpServer()));
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Transcendence API')
    .setDescription('42 school Transcendence API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
