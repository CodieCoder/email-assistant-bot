import { Logger, Module } from '@nestjs/common';
import { EmailReceivingService } from './email-receiving.service';
import { QueueService } from '../queue/queue.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [EmailReceivingService, QueueService, Logger], // Include the service that handles email receiving and config fetching
  exports: [EmailReceivingService], // Export the service to be used elsewhere
})
export class EmailReceivingModule {}
