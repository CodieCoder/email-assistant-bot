import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueNameEnum, QueueProcessEnum } from './dtos/queue.dto';
import { IEmailMessageQueue, IProcessedEmailMessageQueue } from 'src/lib/types';
import { MessageService } from '../emailAnalyst/message.service';

/**
 * @description : This service is responsible for processing the email queue and analyzing email data, saving the processed data to DB and add to processedEmailQueue.
 */
@Processor(QueueNameEnum.EmailQueue)
@Injectable()
export class EmailQueueProcessorService {
  constructor(
    @InjectQueue(QueueNameEnum.ProcessedEmailQueue)
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
}
