import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  QUEUE_PROCESS_KEYS,
  QUEUE_TABLE_KEYS,
  QueueProcessEnum,
} from './dtos/queue.dto';
import { IEmailMessageQueue } from 'src/lib/dtos';
import {
  ITelegramIncomingMessageQueue,
  ITelegramOutgoingMessageQueue,
} from 'src/lib/dtos/telegram';

/**
 * @description : This service is responsible for adding emails to the queue
 */
@Injectable()
export class QueueService implements OnModuleDestroy {
  constructor(
    @InjectQueue(QUEUE_TABLE_KEYS.EMAIL.NEW) private emailQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.INCOMING)
    private telegramIncomingQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.OUTGOING)
    private telegramOutgoingQueue: Queue,
    private loggerService: Logger,
  ) {}

  async addEmailToQueue(emailData: IEmailMessageQueue) {
    this.logger(emailData);
    await this.emailQueue.add(QueueProcessEnum.ProcessEmail, emailData);
  }

  async addTelegramToQueueIncoming(
    telegramData: ITelegramIncomingMessageQueue,
  ) {
    this.logger('Adding to Telegram Incoming Queue');
    this.logger(telegramData);
    try {
      await this.telegramIncomingQueue.add(
        QUEUE_PROCESS_KEYS.TELEGRAM.INCOMING,
        telegramData,
      );
    } catch (error) {
      this.logger('Error adding to Telegram queue failed. ', error);
      throw new Error('Failed to add Telegram Incoming message to queue');
    }
  }

  async addTelegramToQueueOutgoing(
    telegramData: ITelegramOutgoingMessageQueue,
  ) {
    this.logger('Adding to Telegram Outgoing Queue');
    this.logger(telegramData);
    try {
      await this.telegramOutgoingQueue.add(
        QUEUE_PROCESS_KEYS.TELEGRAM.OUTGOING,
        telegramData,
      );
    } catch (error) {
      this.logger('Error adding to Telegram queue failed. ', error);
      throw new Error('Failed to add Telegram Outgoing message to queue');
    }
  }

  private logger(...args: any[]) {
    this.loggerService.log('--- QUEUE SERVICE --- :  ', ...args);
  }

  async onModuleDestroy() {
    try {
      await this.emailQueue.close();
      await this.telegramIncomingQueue.close();
      await this.telegramOutgoingQueue.close();
      this.logger('All queues closed successfully');
    } catch (error) {
      this.logger('Error closing queues:', error);
      throw new Error('Failed to close queues');
    }
  }
}
