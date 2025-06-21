import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  QUEUE_PROCESS_KEYS,
  QUEUE_TABLE_KEYS,
  QueueProcessEnum,
} from '../dtos/queue.dto';
import { IEmailMessageQueue, IProcessedEmailMessageQueue } from 'src/lib/dtos';
import { MessageService } from '../../emailAnalyst/message.service';

/**
 * @description : This service is responsible for processing the email queue and analyzing email data, saving the processed data to DB and add to processedEmailQueue.
 */
@Processor(QUEUE_TABLE_KEYS.EMAIL.NEW)
@Injectable()
export class EmailQueueProcessorService implements OnModuleDestroy {
  constructor(
    @InjectQueue(QUEUE_PROCESS_KEYS.EMAIL.PROCESSED)
    private processedEmailQueue: Queue,
    private readonly messageService: MessageService,
  ) {}

  @Process(QueueProcessEnum.ProcessEmail)
  async handleProcessEmail(job: Job<IEmailMessageQueue>) {
    const emailData = job.data;

    const processed = await this.analyzeEmail(emailData);

    await this.processedEmailQueue.add(QueueProcessEnum.ProcessTool, processed);
  }

  private async analyzeEmail(
    queueData: IEmailMessageQueue,
  ): Promise<IProcessedEmailMessageQueue> {
    const processedEmail = await this.messageService.processNewEmail(
      queueData.message,
      queueData.user,
    );

    return { processedEmail, user: queueData.user };
  }

  async onModuleDestroy() {
    await this.processedEmailQueue.close();
  }
}
