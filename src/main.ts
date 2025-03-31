import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './lib/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ///Validation pipes
  app.useGlobalPipes(new ValidationPipe());

  //Logger
  app.useLogger(app.get(CustomLoggerService));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
