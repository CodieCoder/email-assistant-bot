import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { QueueNameEnum, QueueProcessEnum } from './queue.dto';
import { IProcessedEmailMessageQueue } from 'src/lib/types';

/**
 * @description : This service is responsible for processing the processed email queue and performing actions based on the processed data.
 */
@Processor(QueueNameEnum.ProcessedEmailQueue)
@Injectable()
export class EmailQueueToolService {
  @Process(QueueProcessEnum.ProcessTool)
  async handleToolActions(job: Job<IProcessedEmailMessageQueue>) {
    const processedData = job.data;

    await this.performAction(processedData);
  }

  private async performAction(data: IProcessedEmailMessageQueue) {
    // Example: trigger notification or workflow
    console.log('Tool Service Action:', data);
  }
}
