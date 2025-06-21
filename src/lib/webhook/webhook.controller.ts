import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { TelegramChatWebhookDto } from '../dtos/webhook';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('telegram')
  async handleTelegramUpdate(
    @Body() body: TelegramChatWebhookDto,
  ): Promise<TelegramChatWebhookDto> {
    return await this.webhookService.telegramWebhook(body);
  }
}
