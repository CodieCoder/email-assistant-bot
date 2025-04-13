import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAICompanyObject } from 'src/app/llm/dtos/llm.dto';
import SenderService from '../sender/sender.service';
import LLMService from '../llm/llm.service';
import {
  EmailMessageDto,
  IEmailAddressWithName,
  IProcessedEmailMessage,
} from 'src/lib/dtos';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { IJwtUserPayload } from '../user/dtos/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { IMessageContext } from './dtos/message.dto';
import { SenderEntity } from '../sender/entities/sender.entity';
import { CompanyEntity } from '../company/company.entity';
import { getCompany } from 'src/lib/utils';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly senderService: SenderService,
    private readonly llmService: LLMService,
    private readonly userService: UserService,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
  ) {}

  async processNewEmail(
    email: EmailMessageDto,
    userInfo: IJwtUserPayload,
  ): Promise<IProcessedEmailMessage> {
    //validate user
    const user: UserEntity = await this.validateUser(userInfo.id);

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
        sender: { email: email.from.name, name: email.from.name } as any,
      });
    }

    // Process sender
    const sender = await this.getOrCreateSender(email.from);

    const emailDomain = this.getEmailDomain(email.from.address);
    let company = await this.getOrCreateCompany(emailDomain);

    // Build context and analyze email
    const context = await this.buildContext(sender, company);
    const aiResponse = await this.llmService.analyzeEmail(email, context);

    // // Process company details
    company = await this.getCompanyDetails(aiResponse.company, emailDomain);

    // // Create and save the new message
    const newMessageRecord: Partial<MessageEntity> = {
      emailId: email.messageId,
      subject: email.subject,
      summary: aiResponse.summary,
      description: aiResponse.description,
      isProcessed: true,
      tags: aiResponse.messageTags,
      sender,
      company,
      user,
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

  private async getOrCreateCompany(
    emailDomain: string,
  ): Promise<CompanyEntity> {
    try {
      let company = await this.companyRepo.findOne({
        where: { emailDomain },
      });

      if (!company) {
        company = this.companyRepo.create({
          emailDomain,
        });
        await this.companyRepo.save({ ...company, ...getCompany(emailDomain) });
      }

      return company;
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating company',
      });
    }
  }

  private async buildContext(
    sender: SenderEntity,
    company: CompanyEntity,
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
      companySummary: company.summary
        ? `${company.summary ? `Company Summary: ${company.summary}` : ''} ${company.description ? `\n Description:  ${company.description}` : ''}`
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

  private async getCompanyDetails(
    data: IAICompanyObject,
    emailDomain: string,
  ): Promise<CompanyEntity> {
    const newCompany: Partial<CompanyEntity> = {
      name: data.name || undefined,
      description: data.description || undefined,
      summary: data.summary || undefined,
      tags: data.tags,
      website: data.website || '',
      emailDomain,
    };

    try {
      let company = await this.companyRepo.findOne({ where: { emailDomain } });

      if (!company) {
        company = this.companyRepo.create(newCompany);
      } else {
        company = Object.assign(company, newCompany);
      }

      return await this.companyRepo.save({
        ...company,
        ...getCompany(emailDomain),
      });
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating company details',
      });
    }
  }

  private async formatResponse(
    message: MessageEntity,
  ): Promise<IProcessedEmailMessage> {
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

  private async validateUser(userId: string): Promise<any> {
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
