import { INestApplication, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import POSTGRES_DB_CONFIG from './config/database/postgres.config.database';
import { ConfigModule } from '@nestjs/config';
import SenderModule from './modules/sender/sender.module';
import { EmailAccountModule } from './modules/emailAccount/email-account.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/emailAnalyst/message.module';
import { SystemModule } from './modules/system/system.module';
import { QueueMonitor } from './modules/queue/queue.monitor';
import { QueueModule } from './modules/queue/queue.module';

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
    SystemModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  constructor(private readonly queueMonitor: QueueMonitor) {}

  onModuleInit() {}

  setupBullMonitor(app: INestApplication) {
    this.queueMonitor.setupBullBoard(app);
  }
}
