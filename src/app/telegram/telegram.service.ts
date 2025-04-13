import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TelegramAccountEntity } from './entities/telegram.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTelegramAccountDto } from './dtos/telegram.dto';

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

  public async add(
    userId: string,
    dto: Partial<CreateTelegramAccountDto>,
  ): Promise<TelegramAccountEntity> {
    const existingAccount = await this.repo.findOne({ where: { userId } });
    if (existingAccount) {
      throw new BadRequestException('Telegram account already exist');
    }

    const newAccount = this.repo.create({
      userId,
      telegramChatId: dto.telegramChatId,
      telegramUsername: dto.telegramUsername,
      isLinked: true,
    });

    return this.repo.save(newAccount);
  }

  public async update(
    id: string,
    dto: Partial<CreateTelegramAccountDto>,
  ): Promise<TelegramAccountEntity> {
    const existingAccount = await this.repo.findOne({ where: { id } });
    if (!existingAccount) {
      throw new Error('Telegram account not found');
    }
    const payload = {
      ...existingAccount,
      ...dto,
    };
    return this.repo.save(payload);
  }

  public async unlinkTelegramAccount(userId: string): Promise<void> {
    const existingAccount = await this.getTelegramAccountByUserId(userId);
    if (existingAccount) {
      existingAccount.isLinked = false;
      await this.repo.save(existingAccount);
    }
  }

  public async findById(
    telegramChatId: string,
    isEnabled = true,
  ): Promise<TelegramAccountEntity | null> {
    const telegramAccount = await this.repo.findOne({
      where: {
        telegramChatId,
        isEnabled,
      },
    });

    return telegramAccount;
  }

  public async findAll(userId: string): Promise<TelegramAccountEntity[]> {
    return this.repo.find({ where: { userId } });
  }
}
