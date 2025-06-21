import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { TelegramBotService } from '../telegram/bots/bot-telegram.service';
import { SystemService } from './system.service';

@Module({
  imports: [TelegramModule],
  controllers: [],
  providers: [TelegramBotService, SystemService],
})
export class SystemModule {}
