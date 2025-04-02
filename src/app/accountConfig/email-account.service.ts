import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccountEntity } from './email-account.entity';
import { UserEmailAccountConfigDto } from './email-account.dto';

@Injectable()
export class EmailAccountService {
  constructor(
    @InjectRepository(EmailAccountEntity)
    private readonly emailConfigRepo: Repository<EmailAccountEntity>,
  ) {}

  async createConfig(userId: string, configDto: UserEmailAccountConfigDto) {
    const payload = {
      ...configDto,
      userId,
    } as EmailAccountEntity;

    const config = this.emailConfigRepo.create(payload);
    return await this.emailConfigRepo.save(config);
  }

  async getConfigsByUser(userId: string) {
    return await this.emailConfigRepo.find({ where: { userId } });
  }

  async updateConfig(configId: string, configDto: UserEmailAccountConfigDto) {
    await this.emailConfigRepo.update(
      configId,
      configDto as EmailAccountEntity,
    );
    return await this.emailConfigRepo.findOne({ where: { id: configId } });
  }

  async deleteConfig(configId: string) {
    return await this.emailConfigRepo.delete(configId);
  }
}
