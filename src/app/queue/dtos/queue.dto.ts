export const QUEUE_TABLE_KEYS = {
  EMAIL: { NEW: 'emailQueue', PROCESSED: 'processedEmailQueue' },
  TELEGRAM: {
    INCOMING: 'telegramIncomingMsgQueue',
    PROCESSED: 'telegramProcessedQueue',
    OUTGOING: 'telegramOutgoingMsgQueue',
  },
} as const;

export const QUEUE_PROCESS_KEYS = {
  EMAIL: { NEW: 'emailQueue', PROCESSED: 'processedEmailQueue' },
  TELEGRAM: {
    INCOMING: 'telegramIncomingMsgQueue',
    PROCESSED: 'telegramProcessedQueue',
    OUTGOING: 'telegramOutgoingMsgQueue',
  },
} as const;

export enum QueueProcessEnum {
  ProcessEmail = 'process-email',
  ProcessTool = 'process-tool',
}
