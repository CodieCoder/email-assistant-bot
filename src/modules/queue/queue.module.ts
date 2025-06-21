import { Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailQueueProcessorService } from './processors/email-queue.processor.service';
import { QUEUE_TABLE_KEYS } from './dtos/queue.dto';
import { QueueService } from './queue.service';
import { MessageService } from '../emailAnalyst/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '../emailAnalyst/entities/message.entity';
import { MessageModule } from '../emailAnalyst/message.module';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { EmailQueueToolService } from './processors/email-queue.tool.service';
import { TelegramQueueProcessorService } from './processors/telegram-queue.processor.service';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramBotService } from '../telegram/bots/bot-telegram.service';
import { TelegramAccountEntity } from '../telegram/entities/telegram.entity';
import SenderModule from '../sender/sender.module';
import { LLMModule } from '../llm/llm.module';
import { DomainEntity } from '../domain/domain.entity';
import { REDIS_DB_CONFIG } from 'src/config/database/redis.config.database';
import Redis, { RedisOptions } from 'ioredis';
import { QueueMonitor } from './queue.monitor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      DomainEntity,
      UserEntity,
      TelegramAccountEntity,
    ]),
    BullModule.forRootAsync({
      useFactory: () => {
        const options = REDIS_DB_CONFIG();
        const redisOptions: RedisOptions = {
          ...options,
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
        };

        return {
          createClient: (type) => {
            switch (type) {
              case 'client':
                return new Redis(redisOptions);
              case 'subscriber':
                return new Redis(redisOptions);
              default:
                return new Redis(redisOptions);
            }
          },
        };
      },
    }),
    BullModule.registerQueue(
      { name: QUEUE_TABLE_KEYS.EMAIL.NEW },
      { name: QUEUE_TABLE_KEYS.EMAIL.PROCESSED },
      { name: QUEUE_TABLE_KEYS.TELEGRAM.INCOMING },
      { name: QUEUE_TABLE_KEYS.TELEGRAM.OUTGOING },
      { name: QUEUE_TABLE_KEYS.TELEGRAM.PROCESSED },
    ),
    MessageModule,
    SenderModule,
    LLMModule,
  ],
  providers: [
    Logger,
    QueueService,
    EmailQueueProcessorService,
    EmailQueueToolService,
    TelegramQueueProcessorService,
    TelegramService,
    TelegramBotService,
    MessageService,
    UserService,
    QueueMonitor,
  ],
  exports: [QueueService, BullModule, QueueMonitor],
})
export class QueueModule {}
