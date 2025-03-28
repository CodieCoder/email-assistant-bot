import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { LLMResponse } from 'src/app/llm/llm.dto';

@Injectable()
class LLMService {
  private groqClient: Groq;

  constructor(private readonly configService: ConfigService) {
    this.groqClient = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async analyzeEmail(content: string, context: any): Promise<LLMResponse> {
    try {
      const prompt = this.buildPrompt(content, context);
      const completion = await this.groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });

      const response = completion.choices[0].message.content;

      if (!response) {
        throw new InternalServerErrorException('No response from AI');
      }

      return this.parseResponse(response);
    } catch (error) {
      console.error('Error during Groq API call:', error);
      throw new InternalServerErrorException('Error during Groq API call');
    }
  }

  private buildPrompt(content: string, context: any): string {
    return `
      Analyze this email in the context of the sender's history:
      
      Sender Summary: ${context.senderSummary}
      Recent Messages: ${context.recentMessages.map((m) => m.content).join('\n')}
      
      Current Email Content:
      ${content}
      
      Respond with a JSON object containing:
      {
        "summary": "Brief summary of email intent",
        "description": "Detailed description of email content",
        "aiReport": {
          "purchase": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          "payment": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "inquiry": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "complaint": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "newsletter": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "subscription": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "advertisement": {
            "confidence": 0-10 scale,
            "reason": Reason for the confidence
          },
          },
          "other": {
            "confidence": 0-10 scale,
            "description": A short description of why it cannot be categorized,
            "reason": Reason for the confidence
          },
        },
        "sentiment": {
            "overall": "positive/negative/neutral",
            "score": -1 to 1,
            "emotions": { ... }
          }
      }
    `;
  }

  private parseResponse(response: string): LLMResponse {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new BadRequestException(error, {
        cause: 'Invalid JSON response from AI',
        description: 'Invalid JSON response from AI',
      });
    }
  }
}

export default LLMService;
