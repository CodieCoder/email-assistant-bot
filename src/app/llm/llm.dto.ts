import { IAISenderObject, TAISenderTagObject } from '../sender';

export interface IAITagReport {
  confidence: number;
  description?: string | null;
  reason: string;
}

export interface ISentimentReport {
  overall: 'positive' | 'negative' | 'neutral';
  score: number; // Range: -1 to 1
  emotions: {
    happiness: number; // Range: 0 to 1
    sadness: number; // Range: 0 to 1
    anger: number; // Range: 0 to 1
    fear: number; // Range: 0 to 1
    surprise: number; // Range: 0 to 1
  };
}

export interface IAITagReportObject {
  purchase: IAITagReport;
  payment: IAITagReport;
  inquiry: IAITagReport;
  complaint: IAITagReport;
  newsletter: IAITagReport;
  subscription: IAITagReport;
  advertisement: IAITagReport;
  other: IAITagReport;
}

export interface IAICompanyObject {
  name: string;
  website: string;
  description: string;
  summary: string;
  tags: TAISenderTagObject;
}

export interface ILLMResponse {
  summary: string;
  description: string;
  sentiment: ISentimentReport;
  messageTags: IAITagReportObject;
  company: IAICompanyObject;
  sender: IAISenderObject;
}
