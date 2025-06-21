import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { IAITagReportObject } from '../../modules/llm/dtos/llm.dto';
import { IJwtUserPayload } from '../../modules/user/dtos/user.dto';

export class EmailMessageDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsNotEmpty()
  @IsObject()
  from: IEmailAddressWithName;

  @IsNotEmpty()
  @IsObject()
  to: IEmailAddressWithName;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  textAsHtml: string;
}

export interface IProcessedEmailMessage {
  emailId: string;
  sender: IEmailAddressWithName;
  subject: string;
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
  SUPPORT_REQUEST = 'supportRequest',
  FEEDBACK = 'feedback',
  URGENT = 'urgent',
  FOLLOW_UP = 'followUp',
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  PROMOTION = 'promotion',
  EVENT = 'event',
  SPAM = 'spam',
  OTHER = 'other',
}

export interface IEmailAddressWithName {
  address: string;
  name: string;
}
