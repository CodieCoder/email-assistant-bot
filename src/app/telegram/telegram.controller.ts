// src/telegram/telegram.controller.ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { Request } from 'express';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('launch')
  async launchTelegramWebhook(): Promise<void> {
    // this.telegramService.launchWebhook();
  }

  @Post('add')
  async addTelegramAccount(@Body() dto: any): Promise<void> {
    // const bot = this.telegramService.addAccount(dto);
    // bot.handleUpdate(req.body);
  }

  @Post('webhook')
  async handleTelegramUpdate(@Req() req: Request): Promise<void> {
    // const bot = this.telegramService.getBotInstance();
    // bot.handleUpdate(req.body);
  }
}
