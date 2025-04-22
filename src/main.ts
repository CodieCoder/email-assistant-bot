import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SanitizeInterceptor } from './lib/interceptors/sanitize.interceptor';

const ALLOWED_IPS = process.env.CORS_ALLOWED_IPS?.split(',') || [];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ///Validation pipes
  app.useGlobalPipes(new ValidationPipe());

  //Global interceptors
  app.useGlobalInterceptors(new SanitizeInterceptor());

  //Logger
  app.useLogger(app.get(Logger));

  // API Versioning
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Email Assistant API')
    .setDescription('API documentation for the Email Assistant Bot')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: ALLOWED_IPS,
    methods: 'GET,POST, PATCH',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  //Bull monitor setup
  const appModule = app.get(AppModule);
  appModule.setupBullMonitor(app);

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
