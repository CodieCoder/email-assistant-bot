import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueNameEnum, QueueProcessEnum } from './queue.dto';
import { IEmailMessageQueue } from 'src/lib/types';

/**
@description : This service is responsible for adding emails to the queue.*/
@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue(QueueNameEnum.EmailQueue) private emailQueue: Queue,
  ) {}

  async addEmailToQueue(emailData: IEmailMessageQueue) {
    await this.emailQueue.add(QueueProcessEnum.ProcessEmail, emailData);
  }
}
