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
import { CompanyEntity } from '../company/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      CompanyEntity,
      UserEntity,
      TelegramAccountEntity,
    ]),
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
  ],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
