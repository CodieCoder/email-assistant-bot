import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { QUEUE_PROCESS_KEYS, QUEUE_TABLE_KEYS } from '../dtos/queue.dto';
import { Job } from 'bull';
import { ITelegramOutgoingMessageQueue } from 'src/lib/dtos/telegram';
import { TelegramBotService } from 'src/app/telegram/bots/bot-telegram.service';

/**
 * @description : This service is responsible for processing the telegram queue and performing actions based on the telegram data.
 */
@Processor(QUEUE_TABLE_KEYS.TELEGRAM.OUTGOING)
@Injectable()
export class TelegramQueueProcessorService {
  private readonly logger = new Logger(TelegramQueueProcessorService.name);

  constructor(
    //   @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.OUTGOING)
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Process(QUEUE_PROCESS_KEYS.TELEGRAM.OUTGOING)
  async handleIncomingTelegram(job: Job<ITelegramOutgoingMessageQueue>) {
    this.sendToTelegram(job.data);
  }

  private async sendToTelegram(data: ITelegramOutgoingMessageQueue) {
    const { chatId, message } = data;
    // send to telegram
    try {
      await this.telegramBotService
        .getBotInstance()
        .telegram.sendMessage(chatId, message);
      this.logger.log('Message sent to Telegram:', message);
    } catch (error) {
      this.logger.error('Failed to send message to Telegram:', error);
    }
  }
}
