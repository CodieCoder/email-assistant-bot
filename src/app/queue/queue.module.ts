import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailQueueProcessorService } from './email-queue.processor.service';
import { QueueNameEnum } from './queue.dto';
import { EmailQueueService } from './email-queue.service';
import { EmailQueueToolService } from './emai-queue.tool.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QueueNameEnum.EmailQueue },
      { name: QueueNameEnum.ProcessedEmailQueue },
    ),
  ],
  providers: [
    EmailQueueService,
    EmailQueueProcessorService,
    EmailQueueToolService,
  ],
  exports: [EmailQueueService],
})
export class EmailModule {}
