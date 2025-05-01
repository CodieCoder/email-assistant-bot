import { INestApplication, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import POSTGRES_DB_CONFIG from './config/database/postgres.config.database';
import { ConfigModule } from '@nestjs/config';
import SenderModule from './app/sender/sender.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomLoggerModule } from './lib/logger/logger.module';
import { CustomLoggerService } from './lib/logger/logger.service';
import { EmailAccountModule } from './app/emailAccount/email-account.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { MessageModule } from './app/emailAnalyst/message.module';
import { LoggingInterceptor } from './lib/logger/logging.interceptor';
import { SystemModule } from './app/system/system.module';
import { QueueMonitor } from './app/queue/queue.monitor';
import { QueueModule } from './app/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.local'],
      
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configObj = POSTGRES_DB_CONFIG();
        return configObj;
      },
    }),
    UserModule,
    AuthModule,
    SenderModule,
    MessageModule,
    EmailAccountModule,
    CustomLoggerModule,
    SystemModule,
    QueueModule,
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
  exports: [],
})
export class AppModule {
  constructor(private readonly queueMonitor: QueueMonitor) {}

  onModuleInit() {}

  setupBullMonitor(app: INestApplication) {
    this.queueMonitor.setupBullBoard(app);
  }
}
