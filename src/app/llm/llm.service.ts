import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { IAITagReport, ILLMResponse } from 'src/app/llm/llm.dto';
import { IMessageContext } from '../emailAnalyst';
import {
  EmailMessageTagDescriptionsEnum,
  SenderTagDescriptionsEnum,
} from 'src/lib/constants';
import { TAISenderTagObject } from '../sender';
import { CustomLoggerService } from 'src/lib/logger';
import { EmailMessageDto } from 'src/lib/types';

@Injectable()
class LLMService {
  private groqClient: Groq;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GROQ_API_KEY is not configured');
    }

    this.groqClient = new Groq({ apiKey });
  }

  /**
   * Analyzes an email using the LLM service.
   * @param content - The email content to analyze.
   * @param context - The context of the sender's history.
   * @returns The LLM response as a structured object.
   */
  async analyzeEmail(
    content: EmailMessageDto,
    context: IMessageContext,
  ): Promise<ILLMResponse> {
    try {
      const prompt = this.buildPrompt(content, context);
      const completion = await this.groqClient.chat.completions.create({
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt },
        ],
        // model: 'llama3-8b-8192',
        model: 'deepseek-r1-distill-qwen-32b',
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new InternalServerErrorException('No response from AI');
      }

      return this.parseResponse(response);
    } catch (error) {
      const message = 'Error during Groq API call';
      this.logger.error({
        message,
        context: this.analyzeEmail.name,
        trace: error,
      });
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Builds the prompt for the LLM service.
   * @param content - The email content.
   * @param context - The context of the sender's history.
   * @returns The prompt as a string.
   */
  private buildPrompt(
    content: EmailMessageDto,
    context: IMessageContext,
  ): string {
    const recentMessages = context.recentMessages
      ?.map(
        ({ description, summary }) =>
          `Description: ${description}\n Summary: ${summary}`,
      )
      .join('\n');

    return `
      Analyze this email in the context of the sender's history:
      
      ${context.senderSummary ? `Sender Summary: ${context.senderSummary}` : ''}
      ${context.companySummary ? `Company Summary: ${context.companySummary}` : ''}
      ${recentMessages ? `\n Recent Messages: ${recentMessages}` : ''}
      
      Current Email Content:
      ${content.content || 'No content available'}
      Sender: ${content.sender || 'Unknown sender'}
      Subject: ${content.subject || 'No subject provided'}
    `;
  }

  /**
   * Parses the response from the LLM service.
   * @param response - The raw JSON response as a string.
   * @returns The parsed response as an object.
   */
  private parseResponse(response: string): ILLMResponse {
    try {
      return JSON.parse(response);
    } catch (error) {
      const message = 'Invalid JSON response from AI';
      this.logger.error({
        message,
        context: this.analyzeEmail.name,
        trace: error,
      });
      throw new BadRequestException(message);
    }
  }

  private getSystemPrompt() {
    const TagMetaDataDescription: IAITagReport = {
      confidence: '0 - 10' as any,
      reason: 'Reason for the confidence',
    };

    const tagDescriptions = Object.keys(SenderTagDescriptionsEnum).reduce(
      (acc, key) => {
        acc[key] = TagMetaDataDescription;
        return acc;
      },
      {} as TAISenderTagObject,
    );

    const messageTags = Object.keys(EmailMessageTagDescriptionsEnum).reduce(
      (acc, key) => {
        acc[key] = TagMetaDataDescription;
        return acc;
      },
      {} as TAISenderTagObject,
    );

    return `You are an advanced email analysis assistant. Your role is to analyze email content in the context of the sender's history and provide structured insights. Use the provided sender summary, recent messages, and email content to generate a detailed response.

Your response must follow this JSON schema:
{
  "summary": "Brief summary of the email's intent",
  "description": "Detailed description of the email's content",
  "sentiment": {
    "overall": "positive/negative/neutral",
    "score": -1 to 1,
    "emotions": {
      "happiness": 0-1,
      "sadness": 0-1,
      "anger": 0-1,
      "fear": 0-1,
      "surprise": 0-1
    }
  },
  "messageTags": ${JSON.stringify(messageTags)},
  "company": {
    "name": "Company Name",
    "website": "Company's website",
    "description": "Company Description",
    "summary": "Company Summary",
    "tags": ${JSON.stringify(tagDescriptions)}
  },
  "sender": {
    "name": "Sender Name",
    "description": "Sender Description",
    "summary": "Sender Summary",
    "tags":  ${JSON.stringify(tagDescriptions)}
  }
}

Ensure your response is valid JSON and adheres to the schema. Be concise but thorough in your analysis. If any required information is missing, provide a placeholder value and explain why it is missing.`;
  }
}

export default LLMService;
