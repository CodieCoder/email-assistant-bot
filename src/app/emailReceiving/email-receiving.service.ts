// email-receiving.service.ts
import { Injectable } from '@nestjs/common';
import {
  EmailAccountService,
  EmailAccountEntity,
  EmailAccountConfigType,
} from '../emailAccount';
import * as Imap from 'imap'; // Import IMAP package
import { simpleParser } from 'mailparser'; // For parsing the email

@Injectable()
export class EmailReceivingService {
  constructor(private readonly emailAccountService: EmailAccountService) {}

  // Function to fetch emails using the configuration
  async fetchEmails(userId: string, config: string): Promise<any> {
    const emailConfig = await this.emailAccountService.getOneConfigByUser(
      userId,
      config,
    ); // Fetch user's email configs

    if (!emailConfig) {
      throw new Error('Email config not found');
    }

    switch (emailConfig.configType) {
      case EmailAccountConfigType.IMAP:
        await this.fetchEmailsViaImap(emailConfig);
        break;
      case EmailAccountConfigType.API:
        await this.fetchEmailsViaApi(emailConfig);
        break;
      case EmailAccountConfigType.OAUTH:
        await this.fetchEmailsViaOauth(emailConfig);
        break;
      default:
        throw new Error('Unsupported email config type');
    }
  }

  // Handle fetching emails via IMAP
  private async fetchEmailsViaImap(config: EmailAccountEntity) {
    const imap = new Imap({
      user: config.imapUsername,
      password: config.imapPassword,
      host: config.imapHost,
      port: config.imapPort,
      tls: config.imapSecure,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;
        imap.search(['UNSEEN'], (err, results) => {
          if (err) throw err;

          const fetch = imap.fetch(results, { bodies: '' });
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) throw err;
                // Handle the parsed email (You can pass it for further processing)
                console.log(parsed.subject);
                console.log(parsed.text);
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
}
