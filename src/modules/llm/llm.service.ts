import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { IAITagReport, ILLMResponse } from 'src/modules/llm/dtos/llm.dto';
import {
  EmailMessageTagDescriptionsEnum,
  SenderTagDescriptionsEnum,
} from 'src/lib/constants';
import { EmailMessageDto } from 'src/lib/dtos';
import { IMessageContext } from '../emailAnalyst/dtos/message.dto';
import { TAISenderTagObject } from '../sender/dtos/sender.dto';
import { getEnvVar } from 'src/config/global';
import { htmlToText } from 'html-to-text';

@Injectable()
class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private groqClient: Groq;
  private readonly MAX_PROCESSED_CONTENT_LENGTH = 5000;

  constructor(private readonly configService: ConfigService) {
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
      const processedContent = this.preprocessEmailContent(content);
      const model = getEnvVar('GROQ_MODEL_MODEL') || 'llama3-8b-8192';
      const prompt = this.buildPrompt(processedContent, content, context);

      const completion = await this.groqClient.chat.completions.create({
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt },
        ],
        model,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new InternalServerErrorException('No response from AI');
      }

      return this.parseResponse(response);
    } catch (error: any) {
      const message = 'Error during Groq API call';
      this.logger.error({
        message,
        context: this.analyzeEmail.name,
        trace: `"${error}"`,
        emailSubject: content.subject,
      });

      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Preprocesses email content to strip HTML and truncate if necessary.
   * @param content - Email DTO.
   * @returns Cleaned and potentially truncated text content.
   */
  private preprocessEmailContent(content: EmailMessageDto): string {
    let text = '';

    if (content.textAsHtml) {
      try {
        text = htmlToText(content.textAsHtml, {
          wordwrap: false,
          selectors: [
            { selector: 'img', format: 'skip' },
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'style', format: 'skip' },
            { selector: 'script', format: 'skip' },
          ],
        });
      } catch (err) {
        this.logger.error(
          `Failed to convert HTML to text for email subject "${content.subject}". Falling back to text.`,
          err,
        );

        text = content.text || '';
      }
    } else if (content.text) {
      text = content.text;
    }

    // Remove excessive whitespace and newlines
    text = text
      .replace(/\s\s+/g, ' ')
      .replace(/(\r\n|\n|\r){3,}/g, '\n\n')
      .trim();

    // Truncate if the cleaned text is still too long for the LLM
    if (text.length > this.MAX_PROCESSED_CONTENT_LENGTH) {
      this.logger.warn(
        `Email content truncated from ${text.length} to ${this.MAX_PROCESSED_CONTENT_LENGTH} characters. Subject: "${content.subject}"`,
      );
      text =
        text.substring(0, this.MAX_PROCESSED_CONTENT_LENGTH) +
        '... [TRUNCATED]';
    }

    return text || 'No content available';
  }

  /**
   * Builds the prompt for the LLM service.
   * @param processedContent - The cleaned and truncated email body text.
   * @param originalContent - The original email DTO (for subject, sender).
   * @param context - The context of the sender's history.
   * @returns The prompt as a string.
   */
  private buildPrompt(
    processedContent: string,
    originalContent: EmailMessageDto,
    context: IMessageContext,
  ): string {
    const recentMessages = context.recentMessages
      ?.map(
        ({ description, summary }) =>
          `Description: ${description}\n Summary: ${summary}`,
      )
      .join('\n');

    const senderName = originalContent.from?.name;
    const senderAddress = originalContent.from?.address;
    let senderInfo = 'unknown sender';
    if (senderAddress && senderName) {
      senderInfo = `name: ${senderName}, email: ${senderAddress}`;
    } else if (senderAddress) {
      senderInfo = `email: ${senderAddress}`;
    } else if (senderName) {
      senderInfo = `name: ${senderName}`;
    }

    return `
Analyze this email in the context of the sender's history:

${context.senderSummary ? `Sender Summary: ${context.senderSummary}` : ''}
${context.domainSummary ? `Domain Summary: ${context.domainSummary}` : ''}
${recentMessages ? `\nRecent Messages:\n${recentMessages}` : ''}

Current Email:
Sender: ${senderInfo}
Subject: ${originalContent.subject || 'No subject provided'}
Content:
${processedContent}
    `;
  }

  /**
   * Parses the response from the LLM service.
   * @param response - The raw JSON response as a string.
   * @returns The parsed response as an object.
   */
  private parseResponse(response: string): ILLMResponse {
    try {
      return JSON.parse(response) as ILLMResponse;
    } catch (error: any) {
      const message = 'Invalid JSON response from AI';
      this.logger.error({
        message,
        context: this.parseResponse.name,
        responseSnippet: response.substring(0, 200),
        trace: `"${(error as Error)?.message}"`,
      });
      throw new BadRequestException(message);
    }
  }

  private getSystemPrompt() {
    const TagMetaDataDescription: IAITagReport = {
      confidence: '0 - 10' as unknown as number,
      reason: 'Reason for the confidence',
    };

    const senderTagDescriptions = Object.keys(SenderTagDescriptionsEnum).reduce(
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

    //Today's date so the LLM is aware of the current date
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const time = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const formattedDateTime = `${date} ${time}`;

    return `You are my personal email assistant. Analyze the email content and provide structured insights in the following JSON format:
  
  {
    "summary": "Brief summary of the email's intent",
    "description": "Give me detailed description of the email's content. Make your tone personal and casual",
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
    "domain": {
      "name": "Company Name",
      "website": "Company's website",
      "description": "Company Description",
      "summary": "Company Summary",
      "tags": ${JSON.stringify(senderTagDescriptions)}
    },
    "sender": {
      "name": "Sender Name",
      "description": "Sender Description",
      "summary": "Sender Summary",
      "tags": ${JSON.stringify(senderTagDescriptions)}
    }
  }
  
  After providing the JSON, include a conversational explanation of the email. For example:
  - "This email is about a payment request from Unisoff Inc. They’ve approved the proforma invoice and are asking for payment by the due date. The tone is professional and appreciative."
  - "The sender, E. John, is acting on behalf of Unisoff Inc. and has provided clear next steps for payment confirmation."

  Todays' date is : ${formattedDateTime}
  
  Ensure your response is valid JSON and adheres to the schema. Be concise but thorough in your analysis.`;
  }
}

export default LLMService;
