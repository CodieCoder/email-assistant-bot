import { SenderTagDescriptionsEnum } from 'src/lib/constants';
import { IAITagReport } from '../llm';

export type TAISenderTagObject = {
  [key in keyof typeof SenderTagDescriptionsEnum]: IAITagReport;
};

export interface IAISenderObject {
  name?: string;
  summary?: string;
  description?: string;
  tags?: TAISenderTagObject;
}
