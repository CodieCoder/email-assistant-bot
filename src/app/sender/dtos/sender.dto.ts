import { IAITagReport } from 'src/app/llm/dtos/llm.dto';
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
