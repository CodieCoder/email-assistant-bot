import { IAITagReportObject } from 'src/app/llm/llm.dto';

export class EmailDto {
  to: string;
  subject: string;
  messageId: string;
  sender: string;
  content: string;
}

export interface ProcessedMessageDto {
  messageId: string;
  sender: string;
  summary: string;
  description: string;
  tag: string[];
  aiReport: IAITagReportObject;
}

export interface IMessageContext {
  senderSummary: string;
  recentMessages?: {
    description: string;
    summary: string;
  }[];
}
