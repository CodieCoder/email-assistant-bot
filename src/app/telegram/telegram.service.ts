// src/telegram/telegram.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { getEnvVar } from 'src/config/global';
import { Telegraf } from 'telegraf';
import { TelegramAccountEntity } from './entities/telegram.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @InjectRepository(TelegramAccountEntity)
    private readonly repo: Repository<TelegramAccountEntity>,
  ) {}

  public async getTelegramAccountByUserId(
    userId: string,
  ): Promise<TelegramAccountEntity | null> {
    return this.repo.findOne({ where: { userId } });
  }

  public async linkTelegramAccount(
    userId: string,
    telegramChatId: string,
    telegramUsername?: string,
  ): Promise<TelegramAccountEntity> {
    const existingAccount = await this.getTelegramAccountByUserId(userId);
    if (existingAccount) {
      existingAccount.telegramChatId = telegramChatId;
      existingAccount.telegramUsername = telegramUsername;
      existingAccount.isLinked = true;
      return this.repo.save(existingAccount);
    }

    const newAccount = this.repo.create({
      userId,
      telegramChatId,
      telegramUsername,
      isLinked: true,
    });
    return this.repo.save(newAccount);
  }
}
