export interface IMessageContext {
  senderSummary?: string;
  companySummary?: string;
  recentMessages?: {
    description: string;
    summary: string;
  }[];
}
