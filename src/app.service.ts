import { Injectable } from '@nestjs/common';

type ProcessedEmail = any;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
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
