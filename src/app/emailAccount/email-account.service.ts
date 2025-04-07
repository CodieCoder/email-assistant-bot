import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccountEntity } from './entities/email-account.entity';
import {
  CreateApiConfigDto,
  CreateEmailAccountDto,
  CreateImapConfigDto,
  CreateOauthConfigDto,
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
  ) {}

  async createConfig(userId: string, configDto: CreateEmailAccountDto) {
    //Validate user and make sure user does not have more than one config of the same type
    const user = await this.userService.findOneById(userId);
    if (!user) {
      console.error('Invalid user', userId);
      throw new UnauthorizedException({ description: 'Invalid user' });
    }

    console.log('User', userId);

    //Check and get for config
    const existingConfig = await this.emailConfigRepo.findOne({
      where: { userId, configType: configDto.configType },
    });

    if (existingConfig) {
      console.error('Duplicate configuration : ', existingConfig);
      throw new BadRequestException({
        description: `User already has a configuration of type ${configDto.configType}`,
      });
    }

    let configPayload: Partial<EmailAccountEntity> = {
      userId,
      ...configDto,
    };

    switch (configDto.configType) {
      case EmailAccountConfigType.IMAP:
        configPayload = this.getImapConfigPayload(
          configDto as CreateImapConfigDto,
        );
        break;
      case EmailAccountConfigType.API:
        configPayload = this.getApiConfigPayload(
          configDto as CreateApiConfigDto,
        );
        break;
      case EmailAccountConfigType.OAUTH:
        configPayload = this.getOauthConfigPayload(
          configDto as CreateOauthConfigDto,
        );
        break;
      default:
        throw new Error('Unknown config type');
    }

    console.error('Final Config payload : ', configPayload);

    const config = this.emailConfigRepo.create(configPayload);
    console.error('Saving config... : ', config);

    const savedConfig = await this.emailConfigRepo.save(config);
    console.log('Saved Config : ', savedConfig);
    return savedConfig;
  }

  // Update a configuration for the user
  async updateConfig(
    userId: string,
    configId: string,
    configDto: Partial<CreateEmailAccountDto>,
  ): Promise<EmailAccountEntity | null> {
    let updatedConfig: Partial<EmailAccountEntity> = {
      ...configDto,
    };

    //get current config
    const existingConfig = await this.getOneConfigByUser(userId, configId);
    if (!existingConfig) {
      throw new BadRequestException({
        description: 'Configuration not found',
      });
    }

    switch (configDto.configType) {
      case EmailAccountConfigType.IMAP:
        updatedConfig = this.getImapConfigPayload(
          configDto as CreateImapConfigDto,
        );
        break;
      case EmailAccountConfigType.API:
        updatedConfig = this.getApiConfigPayload(
          configDto as CreateApiConfigDto,
        );
        break;
      case EmailAccountConfigType.OAUTH:
        updatedConfig = this.getOauthConfigPayload(
          configDto as CreateOauthConfigDto,
        );
        break;
      default:
        throw new Error('Unknown config type');
    }

    const config = { ...existingConfig, ...updatedConfig };

    await this.emailConfigRepo.update({ userId, id: configId }, config);

    return await this.emailConfigRepo.findOne({ where: { id: configId } });
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

  private getImapConfigPayload(configDto: CreateImapConfigDto) {
    const payload = {
      ...configDto,
      configType: EmailAccountConfigType.IMAP,
    };

    console.error('IMAP Config payload : ', payload);
    return payload;
  }

  private getApiConfigPayload(configDto: CreateApiConfigDto) {
    const payload = {
      ...configDto,
      configType: EmailAccountConfigType.API,
    };

    return payload;
  }

  private getOauthConfigPayload(configDto: CreateOauthConfigDto) {
    const payload = {
      ...configDto,
      configType: EmailAccountConfigType.OAUTH,
    };

    return payload;
  }

  public async activateImapConfig(userId: string, configId: string) {
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
    const userInfo: IJwtUserPayload = { email: user.email, id: user.id };
    const testImapConnection = await this.emailService.fetchEmails(
      config,
      userInfo,
    );
    if (!testImapConnection) {
      throw new BadRequestException({
        description: 'Failed to connect to IMAP server',
      });
    }

    return;
  }
}
