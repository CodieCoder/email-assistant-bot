import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccountEntity } from './entities/email-account.entity';
import {
  CreateEmailAccountDto,
  EmailAccountConfigType,
} from './dtos/email-account.dto';
import { UserService } from '../user/user.service';
import { EmailReceivingService } from '../emailReceiving/email-receiving.service';
import { IJwtUserPayload } from '../user/dtos/user.dto';

@Injectable()
export class EmailAccountService {
  constructor(
    @InjectRepository(EmailAccountEntity)
    private readonly emailConfigRepo: Repository<EmailAccountEntity>,
    private readonly userService: UserService,
    private readonly emailService: EmailReceivingService,
    private readonly loggerService: Logger,
  ) {}

  async createConfig(userId: string, configDto: CreateEmailAccountDto) {
    this.loggerService.log(`Creating config for user: ${userId}`);

    const user = await this.userService.findOneById(userId);
    this.loggerService.log({ message: 'User found', user });

    if (!user?.id) {
      this.loggerService.error('CREATE CONFIG : Invalid user', userId);
      throw new UnauthorizedException({ description: 'Invalid user' });
    }

    //Check and get for config
    const existingConfig = await this.emailConfigRepo.findOne({
      where: { userId: user.id, configType: configDto.configType },
    });

    if (existingConfig) {
      this.loggerService.error({
        message: 'Duplicate configuration',
        existingConfig,
      });
      throw new BadRequestException({
        description: `User already has a configuration of type ${configDto.configType}`,
      });
    }

    const configPayload: Partial<EmailAccountEntity> = {
      userId: user.id,
      ...configDto,
    };

    const config = this.emailConfigRepo.create(configPayload);
    const savedConfig = await this.emailConfigRepo.save(config);

    // Mask sensitive data before returning
    const configToReturn = { ...savedConfig };
    if (configToReturn.imapPassword) configToReturn.imapPassword = '********';
    this.loggerService.log({
      message: 'Config created',
      config: configToReturn,
    });
    return configToReturn;
  }

  // Update a configuration for the user
  async updateConfig(
    userId: string,
    configId: string,
    configDto: Partial<CreateEmailAccountDto>,
  ): Promise<EmailAccountEntity | null> {
    // Get current config
    const existingConfig = await this.getOneConfigByUser(userId, configId);
    if (!existingConfig) {
      throw new BadRequestException({
        description: 'Configuration not found',
      });
    }

    // Apply updates to the existing config
    const config = this.emailConfigRepo.merge(existingConfig, configDto);

    // If password is being updated, ensure it's handled correctly (e.g., hashed)
    // For now, assuming configDto directly contains the new password if provided.
    // If configDto.imapPassword exists, it will overwrite existingConfig.imapPassword.
    // If hashing is needed, it should happen here before saving.

    await this.emailConfigRepo.update({ userId, id: configId }, config);

    const savedConfig = await this.emailConfigRepo.findOne({
      where: { id: configId },
    });

    // Mask sensitive data before returning
    const configToReturn = { ...savedConfig };
    if (configToReturn?.imapPassword) configToReturn.imapPassword = '********';

    this.loggerService.log({
      message: 'Config updated',
      config: configToReturn,
    });

    return savedConfig;
  }

  // Fetch all email configs for a user
  async getConfigsByUser(userId: string): Promise<EmailAccountEntity[] | null> {
    return await this.emailConfigRepo.find({ where: { userId } });
  }

  // Fetch all email configs for a user
  async getOneConfigByUser(
    userId: string,
    configId: string,
  ): Promise<EmailAccountEntity | null> {
    return await this.emailConfigRepo.findOne({
      where: { userId, id: configId },
    });
  }

  async getUsrActiveConfig(userId: string): Promise<EmailAccountEntity | null> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException({ description: 'Invalid user' });
    }

    const activeConfig = await this.emailConfigRepo.findOne({
      where: { userId, id: user.activeConfigId },
    });

    if (!activeConfig) {
      throw new BadRequestException({
        description: 'User does not have an active configuration',
      });
    }
    return activeConfig;
  }

  // Delete a configuration by ID
  async deleteConfig(configId: string, userId: string) {
    return await this.emailConfigRepo.delete({ id: configId, userId: userId });
  }

  public async syncImapConfig(userId: string, configId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException({ description: 'Invalid user' });
    }
    const config = await this.emailConfigRepo.findOne({
      where: { id: configId, userId },
    });
    if (!config) {
      throw new BadRequestException({
        description: 'Configuration not found',
      });
    }
    if (config.configType !== EmailAccountConfigType.IMAP) {
      throw new BadRequestException({
        description: 'Configuration is not of type IMAP',
      });
    }

    //test the connection
    // The fetchEmails method seems to perform side effects (adding to queue).
    // If this method is purely for "testing connection", it should return a boolean
    // or throw an error on failure, and not trigger email fetching.
    // If it's meant to trigger a sync, the name should reflect that.
    const userInfo: IJwtUserPayload = { email: user.email, id: user.id };
    await this.emailService.fetchEmails(config, userInfo);
    // Assuming fetchEmails throws an error if connection fails,
    // otherwise, this line implies success.
    this.loggerService.log(
      `IMAP config ${configId} synced successfully for user ${userId}`,
    );
    return {
      success: true,
      message: 'IMAP connection tested and sync initiated.',
    };
  }
}
