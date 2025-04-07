import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueNameEnum, QueueProcessEnum } from './dtos/queue.dto';
import { IEmailMessageQueue } from 'src/lib/types';

/**
@description : This service is responsible for adding emails to the queue.*/
@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue(QueueNameEnum.EmailQueue) private emailQueue: Queue,
  ) {}

  async addEmailToQueue(emailData: IEmailMessageQueue) {
    this.logger(emailData);
    await this.emailQueue.add(QueueProcessEnum.ProcessEmail, emailData);
  }

  private logger(message: any) {
    console.log('--- QUEUE SERVICE ---');
    console.log('QUEUE SERVICE :', message);
  }
}
