import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccountEntity } from './email-account.entity';
import {
  CreateEmailAccountDto,
  EmailAccountConfigType,
} from './email-account.dto';

@Injectable()
export class EmailAccountService {
  constructor(
    @InjectRepository(EmailAccountEntity)
    private readonly emailConfigRepo: Repository<EmailAccountEntity>,
  ) {}

  // Handle multiple config types with a switch based on configType enum
  async createConfig(userId: string, configDto: CreateEmailAccountDto) {
    let configPayload: Partial<EmailAccountEntity> = {
      userId,
      ...configDto,
    };

    // Using the enum for the switch case
    switch (configDto.configType) {
      case EmailAccountConfigType.IMAP:
        // Handle IMAP specific configuration logic
        break;
      case EmailAccountConfigType.API:
        // Handle API specific configuration logic
        break;
      case EmailAccountConfigType.OAUTH:
        // Handel OAuth specific configuration logic
        break;
      case EmailAccountConfigType.OTHER:
        // Handle custom config logic
        break;
      default:
        throw new Error('Unknown config type');
    }

    const config = this.emailConfigRepo.create(configPayload);
    return await this.emailConfigRepo.save(config);
  }

  // Fetch all email configs for a user
  async getConfigsByUser(userId: string): Promise<EmailAccountEntity[] | null> {
    return await this.emailConfigRepo.find({ where: { userId } });
  }

  // Fetch all email configs for a user
  async getOneConfigByUser(
    userId: string,
    id: string,
  ): Promise<EmailAccountEntity | null> {
    return await this.emailConfigRepo.findOne({ where: { userId, id } });
  }

  // Update a configuration for the user
  async updateConfig(
    configId: string,
    configDto: CreateEmailAccountDto,
  ): Promise<EmailAccountEntity | null> {
    let updatedConfig: Partial<EmailAccountEntity> = {
      ...configDto,
    };

    // Using the enum for the switch case
    switch (configDto.configType) {
      case EmailAccountConfigType.IMAP:
        // Handle IMAP update logic
        break;
      case EmailAccountConfigType.API:
        // Handle API update logic
        break;
      case EmailAccountConfigType.OAUTH:
        // Handle OAuth update logic
        break;
      case EmailAccountConfigType.OTHER:
        // Handle custom config update logic
        break;
      default:
        throw new Error('Unknown config type');
    }

    await this.emailConfigRepo.update(configId, updatedConfig);
    return await this.emailConfigRepo.findOne({ where: { id: configId } });
  }

  // Delete a configuration by ID
  async deleteConfig(configId: string) {
    return await this.emailConfigRepo.delete(configId);
  }
}
