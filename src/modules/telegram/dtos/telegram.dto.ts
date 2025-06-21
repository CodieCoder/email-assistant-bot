import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTelegramAccountDto {
  @IsNotEmpty()
  @IsString()
  telegramChatId: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;
  @IsOptional()
  @IsBoolean()
  isLinked?: boolean;
}

export class UpdateTelegramAccountDto {
  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @IsOptional()
  @IsBoolean()
  isLinked?: boolean;
}

export enum TelegramCommandEnum {
  Summary = 'summary',
}
