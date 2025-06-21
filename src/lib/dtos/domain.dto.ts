import { MessageDto } from 'src/modules/emailAnalyst/dtos/message.dto';
import { TAISenderTagObject } from 'src/modules/sender/dtos/sender.dto';

export interface DomainDto {
  name: string;
  emailDomain: string;
  website: string;
  description?: string;
  summary?: string;
  tags: TAISenderTagObject;
  messages: MessageDto[];
}
