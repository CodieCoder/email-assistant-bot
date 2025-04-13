import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TelegramMessageUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsBoolean()
  is_bot: boolean;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  language_code?: string;
}

export class TelegramMessageChatDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class TelegramMessageDto {
  @IsNotEmpty()
  @IsNumber()
  message_id: number;

  @ValidateNested()
  @Type(() => TelegramMessageUserDto)
  from: TelegramMessageUserDto;

  @ValidateNested()
  @Type(() => TelegramMessageChatDto)
  chat: TelegramMessageChatDto;

  @IsNotEmpty()
  @IsNumber()
  date: number;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class TelegramChatWebhookDto {
  @IsNotEmpty()
  @IsNumber()
  update_id: number;

  @ValidateNested()
  @Type(() => TelegramMessageDto)
  message: TelegramMessageDto;
}
