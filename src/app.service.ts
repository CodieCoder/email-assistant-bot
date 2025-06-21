import { Injectable } from '@nestjs/common';
import { EmailMessageDto, IProcessedEmailMessage } from './lib/dtos/index.js';
import { MessageService } from './modules/emailAnalyst/message.service.js';
import { IJwtUserPayload } from './modules/user/dtos/user.dto.js';

type ProcessedEmail = IProcessedEmailMessage;

@Injectable()
export class AppService {
  constructor(private readonly messageService: MessageService) {}

  getHello(): string {
    return 'Hello World! Server is running.';
  }

  async testMessage(emailMessage: EmailMessageDto, userInfo: IJwtUserPayload) {
    const processedEmail = await this.messageService.processNewEmail(
      emailMessage,
      userInfo,
    );

    return processedEmail;
  }

  handleEmail(email: ProcessedEmail) {
    switch (email.tags[0]) {
      case 'Purchase':
        this.handlePurchase(email);
        break;
      case 'Payment':
        this.handlePayment(email);
        break;
      // Add other cases
    }
  }

  private handlePurchase(email: ProcessedEmail) {
    // if (email.aiReport.purchase.confidence >= 7) {
    //   //...
    // }

    console.log(email);
    return email;
  }

  private handlePayment(email: ProcessedEmail) {
    // if (email.aiReport.payment.confidence >= 7) {
    //   //....
    // }

    console.log(email);
    return email;
  }
}
