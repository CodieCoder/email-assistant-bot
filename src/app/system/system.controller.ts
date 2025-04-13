import { Controller, Post } from '@nestjs/common';
import { TelegramBotService } from '../telegram/bots/bot-telegram.service';

@Controller('system')
export class SystemController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post('launch')
  async launchTelegramWebhook(): Promise<void> {
    this.telegramBotService.launchWebhook();
  }
}
