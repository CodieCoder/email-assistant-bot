import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name);

  constructor() {}

  public async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    // Implement your email sending logic here
    // You can use a library like Nodemailer or AWS SES to send emails
    // Example:
    // await sendEmail(to, subject, html);
    this.logger.log({ message: 'Sending email...' });
    this.logger.log({ message: to });
    this.logger.log({ message: subject });
    this.logger.log({ message: html });
  }
}
