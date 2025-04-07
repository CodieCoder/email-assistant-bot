import { Injectable } from '@nestjs/common';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EmailAccountConfigType } from '../emailAccount/dtos/email-account.dto';
import { EmailAccountEntity } from '../emailAccount/entities/email-account.entity';

import emailAddresses, { ParsedMailbox } from 'email-addresses';
import { EmailMessageDto, IEmailAddressWithName } from 'src/lib/types';
import { EmailQueueService } from '../queue/email-queue.service';
import { IJwtUserPayload } from '../user/dtos/user.dto';
const fs = require('fs');
const path = require('path');

@Injectable()
export class EmailReceivingService {
  constructor(private emailQueueService: EmailQueueService) {}

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
    console.log('Fetching emails via IMAP');

    const imap = new Imap({
      user: config.imapUsername,
      password: config.imapPassword,
      host: config.imapHost,
      port: config.imapPort,
      tls: config.imapSecure,
    });

    console.log('IMAP CONFIG : ', imap);

    imap.once('ready', () => {
      console.log('Opening inbox');
      imap.openBox('INBOX', true, (err, box) => {
        console.log('Opened inbox');
        if (err) throw err;
        console.log('Searching for unseen emails');
        imap.search(['UNSEEN'], (err, results) => {
          if (err) throw err;
          console.log('Found unseen emails');
          console.log('Results: ', results);
          const fetch = imap.fetch(results, { bodies: '' });
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) throw err;
                //Pass it to the queue service
                const messagePayload = this.getRelevantEmailData(parsed);
                this.addToLocalFile(messagePayload);
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
      console.log('Imap hit an error');
      console.log(err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
    });

    imap.connect();
  }

  // Handle fetching emails via API (e.g., Gmail API, Outlook API)
  private async fetchEmailsViaApi(config: EmailAccountEntity) {
    // You need to integrate with the respective APIs to fetch emails
    // Here we would use something like the Google Gmail API to fetch the user's emails
    console.log('Fetching emails via API (e.g., Gmail API)');
    // Example:
    // const client = google.gmail({ version: 'v1', auth: oauth2Client });
    // const res = await client.users.messages.list({ userId: 'me' });
    // Process the emails retrieved from API
  }

  // Handle fetching emails via OAuth (e.g., for Gmail, Outlook)
  private async fetchEmailsViaOauth(config: EmailAccountEntity) {
    // OAuth logic would go here, such as interacting with the OAuth token to access the email provider's API
    console.log('Fetching emails via OAuth');
    // This might involve using Google APIs, Outlook APIs, or similar for OAuth-based email fetching
  }

  private async sendEmailToQueue(
    message: EmailMessageDto,
    user: IJwtUserPayload,
  ) {
    console.log('Sending email to queue', { message, user });
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

    console.log('PARSED EMAIL DATA : ', emailData);

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
        console.log({ userEmail, email: data?.value });
        throw new Error('Email not found');
      }
      return result;
    } catch (error) {
      console.log({ text: data?.text, email: data?.value });
      console.error('Error getting email from values:', error);
      throw new Error('Failed to get email from values');
    }
  }

  private addToLocalFile(parsed: any) {
    try {
      const emailData = JSON.stringify(parsed, null, 2);
      const filePath = path.join(__dirname, 'emails', `${Date.now()}.json`);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, emailData);

      console.log(`Email saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving email to file:', error);
      throw new Error('Failed to save email');
    }
  }

  private extractEmail(text: string): string | null {
    // Regular expression to match email addresses
    const emailRegex = /<([^>]+)>/;
    const match = text.match(emailRegex);

    // Return the email address if found, otherwise return null
    return match ? match[1] : null;
  }
}
