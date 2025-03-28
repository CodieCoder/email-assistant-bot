import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sender } from 'src/entities/email-sender.entity';
import { MessageEntity } from 'src/entities/email.entity';
import { IAITagReportObject } from 'src/app/llm/llm.dto';
import { Repository } from 'typeorm';
import { EmailDto, IMessageContext, ProcessedMessageDto } from './message.dto';
import SenderService from '../sender/sender.service';
import LLMService from '../llm/llm.service';
import { AIReportPlaceholder } from 'src/lib/constants';

// email.service.ts
@Injectable()
class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly senderService: SenderService,
    private readonly llmService: LLMService,
  ) {}

  async processNewEmail(email: EmailDto): Promise<ProcessedMessageDto> {
    // Check if already processed
    const existingMessage = await this.messageRepo.findOne({
      where: { messageId: email.messageId },
    });

    if (existingMessage) {
      return this.formatResponse(existingMessage);
    }

    // Process new email
    const sender = await this.senderService.getOrCreateSender(email.sender);
    if (!sender?.id) {
      throw new Error('Sender not found');
    }

    const context = await this.buildContext(sender);

    const aiResponse = await this.llmService.analyzeEmail(
      email.content,
      context,
    );

    const newMessage: MessageEntity = {
      messageId: email.messageId,
      senderId: sender.id,
      summary: aiResponse.summary,
      description: aiResponse.description,
      processed: true,
      aiReport: aiResponse.aiReport,
      tag: this.determineTag(aiResponse.aiReport),
      sender: sender,
    };

    const newEmail = this.messageRepo.create(newMessage);

    const savedEmail = await this.messageRepo.save(newEmail);
    await this.runPostProcessingTools(newEmail);

    return this.formatResponse(newEmail);
  }

  private async buildContext(sender: Sender): Promise<IMessageContext> {
    const recentMessages = await this.messageRepo.find({
      where: { sender: { id: sender.id } },
      order: { createdAt: 'DESC' },
      take: 2,
    });

    const context: IMessageContext = {
      senderSummary: sender.summary,
    };

    if (recentMessages.length > 0) {
      context.recentMessages = recentMessages.map(
        ({ description, summary }) => ({
          description,
          summary,
        }),
      );
    }

    return context;
  }

  private formatAIConfidenceReport(
    aiReport: IAITagReportObject,
  ): IAITagReportObject {
    const confidences: IAITagReportObject = {
      purchase: aiReport.purchase || AIReportPlaceholder,
      payment: aiReport.payment || AIReportPlaceholder,
      inquiry: aiReport.inquiry || AIReportPlaceholder,
      complaint: aiReport.complaint || AIReportPlaceholder,
      newsletter: aiReport.newsletter || AIReportPlaceholder,
      subscription: aiReport.subscription || AIReportPlaceholder,
      advertisement: aiReport.advertisement || AIReportPlaceholder,
      other: aiReport.other || AIReportPlaceholder,
    };

    return confidences;
  }

  private determineTag(aiReport: IAITagReportObject): string[] {
    const confidences = this.formatAIConfidenceReport(aiReport);

    const tags = Object.keys(confidences).reduce((a: string[], b) => {
      if (confidences[b].confidence > 5) {
        return [...a, b];
      }

      return a;
    }, [] as string[]);

    return tags;
  }

  private async runPostProcessingTools(email: MessageEntity) {
    // Implement post-processing logic here
  }

  private async formatResponse(
    email: MessageEntity,
  ): Promise<ProcessedMessageDto> {
    if (!email) {
      throw new NotFoundException('Email not found');
    }

    return {
      messageId: email.messageId,
      sender: email.sender.email,
      tag: email.tag,
      summary: email.summary,
      description: email.description,
      aiReport: email.aiReport,
    };
  }
}

export default MessageService;
