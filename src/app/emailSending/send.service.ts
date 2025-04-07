import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../lib/logger/logger.service';

@Injectable()
export class EmailerService {
  constructor() {} // private readonly logger: CustomLoggerService

  public async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    // Implement your email sending logic here
    // You can use a library like Nodemailer or AWS SES to send emails
    // Example:
    // await sendEmail(to, subject, html);
    console.log({ message: 'Sending email...' });
    console.log({ message: to });
    console.log({ message: subject });
    console.log({ message: html });
  }
}
