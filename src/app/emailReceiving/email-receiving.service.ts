import { Injectable, Logger } from '@nestjs/common';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EmailAccountConfigType } from '../emailAccount/dtos/email-account.dto';
import { EmailAccountEntity } from '../emailAccount/entities/email-account.entity';

import { EmailMessageDto, IEmailAddressWithName } from 'src/lib/dtos';
import { QueueService } from '../queue/queue.service';
import { IJwtUserPayload } from '../user/dtos/user.dto';
const fs = require('fs');
const path = require('path');

@Injectable()
export class EmailReceivingService {
  constructor(
    private emailQueueService: QueueService,
    private logger: Logger,
  ) {}

  // Function to fetch emails using the configuration
  async fetchEmails(
    config: EmailAccountEntity,
    user: IJwtUserPayload,
  ): Promise<any> {
    switch (config.configType) {
      case EmailAccountConfigType.IMAP:
        await this.fetchEmailsViaImap(config, user);
        break;
      case EmailAccountConfigType.API:
        await this.fetchEmailsViaApi(config);
        break;
      case EmailAccountConfigType.OAUTH:
        await this.fetchEmailsViaOauth(config);
        break;
      default:
        throw new Error('Unsupported email config type');
    }
  }

  // Handle fetching emails via IMAP
  private async fetchEmailsViaImap(config: EmailAccountEntity, user) {
    this.logger.log('Fetching emails via IMAP');

    const imap = new Imap({
      user: config.imapUsername,
      password: config.imapPassword,
      host: config.imapHost,
      port: config.imapPort,
      tls: config.imapSecure,
    });

    this.logger.log('IMAP CONFIG : ', imap);

    imap.once('ready', () => {
      this.logger.log('Opening inbox');
      imap.openBox('INBOX', true, (err, box) => {
        this.logger.log('Opened inbox');
        if (err) throw err;
        this.logger.log('Searching for unseen emails');
        imap.search(['UNSEEN'], (err, results) => {
          if (err) throw err;
          this.logger.log('Unread emails found : ', results || 0);
          if (!results?.length) {
            return;
          }
          const fetch = imap.fetch(results, { bodies: '' });
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) throw err;
                //Pass it to the queue service
                const messagePayload = this.getRelevantEmailData(parsed);
                this.sendEmailToQueue(messagePayload, user);
                // Implement the email analysis or pass it to another service
              });
            });
          });
          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      this.logger.log('Imap hit an error');
      this.logger.log(err);
    });

    imap.once('end', () => {
      this.logger.log('IMAP connection ended');
    });

    imap.connect();
  }

  private async fetchEmailsViaApi(config: EmailAccountEntity) {
    this.logger.log('Fetching emails via API (e.g., Gmail API)');
  }

  private async fetchEmailsViaOauth(config: EmailAccountEntity) {
    this.logger.log('Fetching emails via OAuth');
  }

  private async sendEmailToQueue(
    message: EmailMessageDto,
    user: IJwtUserPayload,
  ) {
    this.logger.log('Sending email to queue', { message, user });
    return this.emailQueueService.addEmailToQueue({ message, user });
  }

  private getRelevantEmailData(data: any): EmailMessageDto {
    const dataString = JSON.stringify(data);
    const parsedData = JSON.parse(dataString);

    const emailData: EmailMessageDto = {
      from: this.getEmailFromValues(parsedData.from),
      to: this.getEmailFromValues(parsedData.to),
      subject: parsedData.subject,
      date: parsedData.date,
      text: parsedData.text,
      textAsHtml: parsedData.textAsHtml,
      messageId: parsedData.messageId,
    };

    this.logger.log('PARSED EMAIL DATA : ', emailData);

    return emailData;
  }

  private getEmailFromValues(data: {
    value: IEmailAddressWithName[];
    text: string;
  }): IEmailAddressWithName {
    try {
      // const userEmail = this.extractEmail(data?.text);
      const userEmail = data?.value?.[0];
      if (!userEmail?.address) throw new Error('No sender found');

      const result = data?.value?.find(
        ({ address }) => address === userEmail.address,
      );

      if (!result) {
        this.logger.log({ userEmail, email: data?.value });
        throw new Error('Email not found');
      }
      return result;
    } catch (error) {
      this.logger.log({ text: data?.text, email: data?.value });
      this.logger.error('Error getting email from values:', error);
      throw new Error('Failed to get email from values');
    }
  }

  private addToLocalFile(parsed: any) {
    try {
      const emailData = JSON.stringify(parsed, null, 2);
      const filePath = path.join(__dirname, 'emails', `${Date.now()}.json`);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, emailData);

      this.logger.log(`Email saved to ${filePath}`);
    } catch (error) {
      this.logger.error('Error saving email to file:', error);
      throw new Error('Failed to save email');
    }
  }

  private extractEmail(text: string): string | null {
    const emailRegex = /<([^>]+)>/;
    const match = text.match(emailRegex);
    // Return the email address if found, otherwise return null
    return match ? match[1] : null;
  }
}
