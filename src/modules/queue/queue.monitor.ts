import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import { QUEUE_TABLE_KEYS } from './dtos/queue.dto';
import * as basicAuth from 'express-basic-auth';
import { getEnvVar } from 'src/config/global';

export class QueueMonitor {
  constructor(
    @InjectQueue(QUEUE_TABLE_KEYS.EMAIL.NEW)
    private readonly emailNewQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.INCOMING)
    private readonly telegramIncomingQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.EMAIL.PROCESSED)
    private readonly processedEmailNewQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.OUTGOING)
    private readonly telegramOutgoingQueue: Queue,
    @InjectQueue(QUEUE_TABLE_KEYS.TELEGRAM.PROCESSED)
    private readonly telegramProcessedQueue: Queue,
  ) {}

  setupBullBoard(app: INestApplication) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [
        new BullAdapter(this.emailNewQueue),
        new BullAdapter(this.telegramIncomingQueue),
        new BullAdapter(this.processedEmailNewQueue),
        new BullAdapter(this.telegramOutgoingQueue),
        new BullAdapter(this.telegramProcessedQueue),
      ],
      serverAdapter,
    });

    app.use(
      '/admin/queues',
      basicAuth({
        users: {
          [getEnvVar('BULL_BOARD_USERNAME')]: getEnvVar('BULL_BOARD_PASSWORD'),
        },
        challenge: true,
        realm: 'Bull Board',
      }),
      serverAdapter.getRouter(),
    );
  }
}
