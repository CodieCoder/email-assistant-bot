// email-receiving.module.ts
import { Module } from '@nestjs/common';
import { EmailAccountService } from '../emailAccount/email-account.service'; // Import the service to fetch user email configs
import { EmailReceivingService } from './email-receiving.service';

@Module({
  imports: [],
  providers: [EmailReceivingService, EmailAccountService], // Include the service that handles email receiving and config fetching
  exports: [EmailReceivingService], // Export the service to be used elsewhere
})
export class EmailReceivingModule {}
