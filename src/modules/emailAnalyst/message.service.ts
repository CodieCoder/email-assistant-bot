import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAIDomainObject } from 'src/modules/llm/dtos/llm.dto';
import SenderService from '../sender/sender.service';
import LLMService from '../llm/llm.service';
import {
  EmailMessageDto,
  IEmailAddressWithName,
  IProcessedEmailMessage,
} from 'src/lib/dtos';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { IJwtUserPayload, UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { IMessageContext } from './dtos/message.dto';
import { SenderEntity } from '../sender/entities/sender.entity';
import { DomainEntity } from '../domain/domain.entity';
import { getDomain } from 'src/lib/utils';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly senderService: SenderService,
    private readonly llmService: LLMService,
    private readonly userService: UserService,
    @InjectRepository(DomainEntity)
    private readonly domainRepo: Repository<DomainEntity>,
  ) {}

  async processNewEmail(
    email: EmailMessageDto,
    userInfo: IJwtUserPayload,
  ): Promise<IProcessedEmailMessage> {
    //validate user
    const user = await this.validateUser(userInfo.id);

    // Validate emailId
    if (!email.messageId) {
      throw new BadRequestException('Email ID is required');
    }

    // Check if the message already exists
    const existingMessage = await this.messageRepo.findOne({
      where: { emailId: email.messageId, userId: user.id },
    });

    if (existingMessage) {
      // Return already processed message
      return this.formatResponse({
        ...existingMessage,
        sender: {
          email: email.from.name,
          name: email.from.name,
        } as SenderEntity,
      });
    }

    // Process sender
    const sender = await this.getOrCreateSender(email.from);

    const emailDomain = this.getEmailDomain(email.from.address);
    let domain = await this.getOrCreateDomain(emailDomain);

    // Build context and analyze email
    const context = await this.buildContext(sender, domain);
    const aiResponse = await this.llmService.analyzeEmail(email, context);

    // // Process domain details
    domain = await this.getDomainDetails(aiResponse.domain, emailDomain);

    // // Create and save the new message
    const newMessageRecord: Partial<MessageEntity> = {
      emailId: email.messageId,
      subject: email.subject,
      summary: aiResponse.summary,
      description: aiResponse.description,
      isProcessed: true,
      tags: aiResponse.messageTags,
      sender,
      domain,
      user: user as UserEntity,
    };

    const newMessage = this.messageRepo.create(newMessageRecord);
    const savedMessage = await this.messageRepo.save(newMessage);

    return this.formatResponse(savedMessage);
  }

  private async getOrCreateSender(
    email: IEmailAddressWithName,
  ): Promise<SenderEntity> {
    try {
      const sender = await this.senderService.getOrCreateSender(email.address);
      if (!sender?.id) {
        throw new Error('Sender not found');
      }
      return sender;
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating sender',
      });
    }
  }

  private async getOrCreateDomain(emailDomain: string): Promise<DomainEntity> {
    try {
      let domain = await this.domainRepo.findOne({
        where: { emailDomain },
      });

      if (!domain) {
        domain = this.domainRepo.create({
          emailDomain,
        });
        await this.domainRepo.save({ ...domain, ...getDomain(emailDomain) });
      }

      return domain;
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating domain',
      });
    }
  }

  private async buildContext(
    sender: SenderEntity,
    domain: DomainEntity,
  ): Promise<IMessageContext> {
    const recentMessages = await this.messageRepo.find({
      where: { sender: { id: sender.id } },
      order: { createdAt: 'DESC' },
      take: 2,
    });

    const context: IMessageContext = {
      senderSummary:
        sender.summary || sender.description
          ? `${sender.summary ? `Sender Summary: ${sender.summary}` : ''} ${sender.description ? `\n Description:  ${sender.description}` : ''}`
          : undefined,
      domainSummary: domain.summary
        ? `${domain.summary ? `Domain Summary: ${domain.summary}` : ''} ${domain.description ? `\n Description:  ${domain.description}` : ''}`
        : undefined,
      recentMessages: recentMessages.length
        ? recentMessages.map(({ description, summary }) => ({
            description,
            summary,
          }))
        : undefined,
    };

    return context;
  }

  private async getDomainDetails(
    data: IAIDomainObject,
    emailDomain: string,
  ): Promise<DomainEntity> {
    const newDomain: Partial<DomainEntity> = {
      name: data.name || undefined,
      description: data.description || undefined,
      summary: data.summary || undefined,
      tags: data.tags,
      website: data.website || '',
      emailDomain,
    };

    try {
      let domain = await this.domainRepo.findOne({ where: { emailDomain } });

      if (!domain) {
        domain = this.domainRepo.create(newDomain);
      } else {
        domain = Object.assign(domain, newDomain);
      }

      return await this.domainRepo.save({
        ...domain,
        ...getDomain(emailDomain),
      });
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating domain details',
      });
    }
  }

  private formatResponse(message: MessageEntity): IProcessedEmailMessage {
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return {
      emailId: message.emailId,
      sender: {
        address: message.sender.email,
        name: message.sender.name || '',
      },
      subject: message.subject,
      summary: message.summary,
      description: message.description,
      tags: message.tags,
    };
  }

  private async validateUser(userId: string): Promise<UserDto> {
    if (!userId) {
      throw new UnauthorizedException('Invalid user : No user found');
    } else {
      const user = await this.userService.findOneById(userId);
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      return user;
    }
  }

  private getEmailDomain(email: string): string {
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      throw new BadRequestException('Invalid email format');
    }
    return emailParts[1];
  }
}
