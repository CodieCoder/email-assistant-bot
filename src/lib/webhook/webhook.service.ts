import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TelegramAccountEntity } from 'src/app/telegram/entities/telegram.entity';
import { TelegramChatWebhookDto } from '../dtos/webhook';
import { QueueService } from 'src/app/queue/queue.service';
import { TelegramService } from 'src/app/telegram/telegram.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly queueService: QueueService,
    private readonly telegramService: TelegramService,
  ) {}

  async telegramWebhook(body: TelegramChatWebhookDto): Promise<any> {
    const { message } = body;
    const { text, chat } = message;
    const { id: chatId, username } = chat;
    const telegramAccount = await this.validateTelegramAccount(String(chatId));

    if (!telegramAccount) {
      throw new UnauthorizedException('Telegram account not found');
    }

    //Add to queue
    const payload = {
      chatId: chatId,
      text,
    };

    // await this.queueService.addTelegramToQueue(payload);

    return body;
  }

  private async validateTelegramAccount(
    chatId: string,
  ): Promise<TelegramAccountEntity> {
    if (!chatId) {
      throw new Error('Telegram account not found');
    }

    const telegramAccount = await this.telegramService.findById(chatId);

    if (!telegramAccount) {
      throw new Error('Telegram account not found');
    }

    return telegramAccount;
  }
}
