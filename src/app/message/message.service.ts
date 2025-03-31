import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenderEntity } from 'src/app/sender';
import {
  MessageEntity,
  EmailMessageDto,
  IMessageContext,
  ProcessedMessageDto,
} from 'src/app/message';
import { IAICompanyObject } from 'src/app/llm/llm.dto';
import SenderService from '../sender/sender.service';
import LLMService from '../llm/llm.service';
import { CompanyEntity } from 'src/entities';
import { IJwtUserPayload, UserEntity, UserService } from '../user';

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
  ): Promise<ProcessedMessageDto> {
    //validate user
    const user: UserEntity = await this.validateUser(userInfo.id);

    // Validate emailId
    if (!email.emailId) {
      throw new BadRequestException('Email ID is required');
    }

    // Check if the message already exists
    const existingMessage = await this.messageRepo.findOne({
      where: { emailId: email.emailId, userId: user.id },
    });

    if (existingMessage) {
      // Return already processed message
      return this.formatResponse({
        ...existingMessage,
        sender: { email: email.sender } as any,
      });
    }

    // Process sender
    const sender = await this.getOrCreateSender(email.sender);

    // Build context and analyze email
    const context = await this.buildContext(sender);
    const aiResponse = await this.llmService.analyzeEmail(email, context);

    // // Process company details
    const company = await this.getCompanyDetails(
      aiResponse.company,
      email.sender,
    );

    // // Create and save the new message
    const newMessageRecord: Partial<MessageEntity> = {
      emailId: email.emailId,
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

  private async getOrCreateSender(email: string): Promise<SenderEntity> {
    try {
      const sender = await this.senderService.getOrCreateSender(email);
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

  private async buildContext(sender: SenderEntity): Promise<IMessageContext> {
    const recentMessages = await this.messageRepo.find({
      where: { sender: { id: sender.id } },
      order: { createdAt: 'DESC' },
      take: 2,
    });

    const context: IMessageContext = {
      senderSummary: sender.summary,
      recentMessages: recentMessages.map(({ description, summary }) => ({
        description,
        summary,
      })),
    };

    return context;
  }

  private async getCompanyDetails(
    data: IAICompanyObject,
    emailAddress: string,
  ): Promise<CompanyEntity> {
    const emailDomain = emailAddress.split('@')[1];
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
        Object.assign(company, newCompany);
      }

      return await this.companyRepo.save(company);
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Error getting or creating company details',
      });
    }
  }

  private async formatResponse(
    message: MessageEntity,
  ): Promise<ProcessedMessageDto> {
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return {
      emailId: message.emailId,
      sender: message.sender.email,
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
}
