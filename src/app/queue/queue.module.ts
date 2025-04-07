import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailQueueProcessorService } from './email-queue.processor.service';
import { QueueNameEnum } from './dtos/queue.dto';
import { EmailQueueService } from './email-queue.service';
import { EmailQueueToolService } from './emai-queue.tool.service';
import { MessageService } from '../emailAnalyst/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '../emailAnalyst/entities/message.entity';
import { MessageModule } from '../emailAnalyst/message.module';
import SenderService from '../sender/sender.service';
import LLMService from '../llm/llm.service';
import { UserService } from '../user/user.service';
import { CompanyEntity } from 'src/entities';
import { SenderEntity } from '../sender/entities/sender.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      CompanyEntity,
      SenderEntity,
      UserEntity,
    ]),
    MessageModule,
    BullModule.registerQueue(
      { name: QueueNameEnum.EmailQueue },
      { name: QueueNameEnum.ProcessedEmailQueue },
    ),
  ],
  providers: [
    EmailQueueService,
    EmailQueueProcessorService,
    EmailQueueToolService,
    MessageService,
    SenderService,
    LLMService,
    UserService,
  ],
  exports: [EmailQueueService, BullModule],
})
export class EmailQueueModule {}
