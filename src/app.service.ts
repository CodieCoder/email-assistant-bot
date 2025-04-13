import { Injectable } from '@nestjs/common';
import { EmailMessageDto } from './lib/dtos/index.js';
import { MessageService } from './app/emailAnalyst/message.service';
import { IJwtUserPayload } from './app/user/dtos/user.dto';

type ProcessedEmail = any;

@Injectable()
export class AppService {
  constructor(private readonly messageService: MessageService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testMessage(emailMessage: EmailMessageDto, userInfo: IJwtUserPayload) {
    const processedEmail = await this.messageService.processNewEmail(
      emailMessage,
      userInfo,
    );

    return processedEmail;
  }

  async handleEmail(email: ProcessedEmail) {
    switch (email.tag) {
      case 'Purchase':
        await this.handlePurchase(email);
        break;
      case 'Payment':
        await this.handlePayment(email);
        break;
      // Add other cases
    }
  }

  private async handlePurchase(email: ProcessedEmail) {
    if (email.aiReport.purchase.confidence >= 7) {
      //...
    }
  }

  private async handlePayment(email: ProcessedEmail) {
    if (email.aiReport.payment.confidence >= 7) {
      //....
    }
  }
}
