import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegramBotService } from './bots/bot-telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramAccountEntity } from './entities/telegram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramAccountEntity])],
  providers: [TelegramService, TelegramBotService],
  controllers: [TelegramController],
  exports: [TelegramService, TelegramBotService],
})
export class TelegramModule {}
