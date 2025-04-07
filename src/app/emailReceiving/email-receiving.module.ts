import { Module } from '@nestjs/common';
import { EmailReceivingService } from './email-receiving.service';
import { EmailQueueService } from '../queue/email-queue.service';
import { EmailQueueModule } from '../queue/queue.module';

@Module({
  imports: [EmailQueueModule],
  providers: [EmailReceivingService, EmailQueueService], // Include the service that handles email receiving and config fetching
  exports: [EmailReceivingService], // Export the service to be used elsewhere
})
export class EmailReceivingModule {}
