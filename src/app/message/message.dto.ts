import { IsEmail, IsString } from 'class-validator';
import { IAITagReportObject } from 'src/app/llm/llm.dto';

export class EmailMessageDto {
  @IsEmail()
  to: string;

  @IsEmail()
  sender: string;

  @IsString()
  subject: string;

  @IsString()
  emailId: string;

  @IsString()
  content: string;
}

export interface ProcessedMessageDto {
  emailId: string;
  sender: string;
  summary: string;
  description: string;
  tags: IAITagReportObject;
}

export interface IMessageContext {
  senderSummary: string;
  recentMessages?: {
    description: string;
    summary: string;
  }[];
}
