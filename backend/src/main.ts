import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import * as fs from 'fs';
import { WSValidationPipe } from './sockets/ws-validation.pipe';
import * as https from 'https'
import { WsAdapter } from './sockets/ws-adapter.class';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./certification/key.pem'),
    cert: fs.readFileSync('./certification/certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { cors: true, httpsOptions });
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new WSValidationPipe()

  );
  const httpsServer = https.createServer(httpsOptions);
  app.useWebSocketAdapter(new WsAdapter(httpsServer));


  initSwaggerDoc(app);
  app.listen(3000);
}
bootstrap();

function initSwaggerDoc(app) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Transcendence API')
    .setDescription('42 school Transcendence API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

