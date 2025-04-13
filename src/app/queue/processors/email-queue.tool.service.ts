import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { QUEUE_TABLE_KEYS, QueueProcessEnum } from '../dtos/queue.dto';
import { IProcessedEmailMessageQueue } from 'src/lib/dtos';
import { TelegramService } from 'src/app/telegram/telegram.service';
import { QueueService } from '../queue.service';
import { ITelegramOutgoingMessageQueue } from 'src/lib/dtos/telegram';

/**
 * @description : This service is responsible for processing the processed email queue and performing actions based on the processed data.
 */
@Processor(QUEUE_TABLE_KEYS.EMAIL.PROCESSED)
@Injectable()
export class EmailQueueToolService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly queueService: QueueService,
    private readonly logger: Logger,
  ) {}

  @Process(QueueProcessEnum.ProcessTool)
  async handleToolActions(job: Job<IProcessedEmailMessageQueue>) {
    const processedData = job.data;

    await this.performAction(processedData);
  }

  private async performAction(data: IProcessedEmailMessageQueue) {
    // Example: Send processed email data to Telegram

    const telegramAccount =
      await this.telegramService.getTelegramAccountByUserId(data.user.id);

    if (!telegramAccount) {
      this.logger.error('Telegram account not found for user:', data.user.id);
      return;
    }

    const chatId = telegramAccount.telegramChatId;
    const message = `📧 Processed Email:
      - Subject: ${data.processedEmail.subject}
      - From: ${data.processedEmail.sender.address}
      - Name: ${data.processedEmail.sender.name}
      - Summary: ${data.processedEmail.summary}
      - Description: ${data.processedEmail.description}`;

    //add to telegram queue
    try {
      this.logger.log('Message queued for sending to Telegram:', message);
    } catch (error) {
      this.logger.error('Failed to send queue message:', error);
    }

    const payload: ITelegramOutgoingMessageQueue = {
      chatId,
      message,
    };

    this.queueService.addTelegramToQueueOutgoing(payload);
  }
}
