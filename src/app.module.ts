import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import POSTGRES_DB_CONFIG from './config/database/postgres.config.database';
import { ConfigModule } from '@nestjs/config';
import UserModule from './app/user/user.module';
import SenderModule from './app/sender/sender.module';
import { MessageModule } from './app/message/';
import { AuthModule } from './app/auth';
import { CustomLoggerService, LoggingInterceptor } from './lib/logger';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './lib/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configObj = POSTGRES_DB_CONFIG();
        return configObj;
      },
    }),
    LoggerModule,
    UserModule,
    AuthModule,
    SenderModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: CustomLoggerService,
      useClass: CustomLoggerService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
  ],
  exports: [CustomLoggerService],
})
export class AppModule {}
