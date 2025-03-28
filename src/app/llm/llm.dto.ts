export interface IAITagReport {
  confidence: number;
  description?: string | null;
  reason: string;
}

export interface ISentimentReport {
  overall: string;
  score: number;
  emotions: string;
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

export interface LLMResponse {
  summary: string;
  description: string;
  aiReport: IAITagReportObject;
}
