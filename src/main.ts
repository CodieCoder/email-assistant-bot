import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './lib/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const ALLOWED_IPS = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ///Validation pipes
  app.useGlobalPipes(new ValidationPipe());

  //Logger
  app.useLogger(app.get(CustomLoggerService));

  // API Versioning
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Email Assistant API')
    .setDescription('API documentation for the Email Assistant Bot')
    .setVersion('1.0')
    .addBearerAuth() // Add support for Bearer token authentication
    .build();

  //Enable CORS
  app.enableCors({
    origin: ALLOWED_IPS,
    methods: 'GET,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  //start server
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
