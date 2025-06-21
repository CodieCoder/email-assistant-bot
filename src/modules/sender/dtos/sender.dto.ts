import { MessageDto } from 'src/modules/emailAnalyst/dtos/message.dto';
import { IAITagReport } from 'src/modules/llm/dtos/llm.dto';
import { SenderTagDescriptionsEnum } from 'src/lib/constants';

export type TAISenderTagObject = {
  [key in keyof typeof SenderTagDescriptionsEnum]: IAITagReport;
};

export interface IAISenderObject {
  name?: string;
  summary?: string;
  description?: string;
  tags?: TAISenderTagObject;
}

export interface SenderDto {
  email: string;
  name?: string;
  summary: string;
  description: string;
  tags?: TAISenderTagObject;
  messages: MessageDto[];
}
