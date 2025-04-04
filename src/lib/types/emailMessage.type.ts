import { IsEmail, IsString } from 'class-validator';
import { IAITagReportObject } from 'src/app/llm';
import { IJwtUserPayload } from 'src/app/user';

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

export interface IProcessedEmailMessage {
  emailId: string;
  sender: string;
  summary: string;
  description: string;
  tags: IAITagReportObject;
}

export type IEmailMessageQueue = {
  message: EmailMessageDto;
  user: IJwtUserPayload;
};

export type IProcessedEmailMessageQueue = {
  processedEmail: IProcessedEmailMessage;
  user: IJwtUserPayload;
};

export enum EmailMessageTypeEnum {
  PURCHASE = 'purchase',
  PAYMENT = 'payment',
  INQUIRY = 'inquiry',
  COMPLAINT = 'complaint',
  NEWSLETTER = 'newsletter',
  SUBSCRIPTION = 'subscription',
  ADVERTISEMENT = 'advertisement',
  OTHER = 'other',
}
