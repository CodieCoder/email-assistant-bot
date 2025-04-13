import { TelegramCommandEnum } from 'src/app/telegram/dtos/telegram.dto';

export interface ITelegramIncomingMessageQueue {
  ctx: any;
  isCommand: boolean;
  command?: TelegramCommandEnum;
}

export interface ITelegramOutgoingMessageQueue {
  chatId: string;
  message: string;
}
