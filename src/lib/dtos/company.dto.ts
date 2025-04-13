import { MessageDto } from 'src/app/emailAnalyst/dtos/message.dto';
import { TAISenderTagObject } from 'src/app/sender/dtos/sender.dto';

export interface CompanyDto {
  name: string;
  emailDomain: string;
  website: string;
  description?: string;
  summary?: string;
  tags: TAISenderTagObject;
  messages: MessageDto[];
}
