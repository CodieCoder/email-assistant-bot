import { Injectable, Logger } from '@nestjs/common';
import * as Imap from 'imap';
import {
  AddressObject,
  EmailAddress,
  ParsedMail,
  simpleParser,
  Source,
} from 'mailparser';
import { EmailAccountConfigType } from '../emailAccount/dtos/email-account.dto';
import { EmailAccountEntity } from '../emailAccount/entities/email-account.entity';

import { EmailMessageDto } from 'src/lib/dtos';
import { QueueService } from '../queue/queue.service';
import { IJwtUserPayload } from '../user/dtos/user.dto';
import { BoxTypes } from './dtos';

@Injectable()
export class EmailReceivingService {
  private readonly logger = new Logger(EmailReceivingService.name);

  constructor(private emailQueueService: QueueService) {}

  // Function to fetch emails using the configuration
  async fetchEmails(
    config: EmailAccountEntity,
    user: IJwtUserPayload,
  ): Promise<void> {
    switch (config.configType) {
      case EmailAccountConfigType.IMAP:
        await this.fetchEmailsViaImap(config, user);
        break;
      case EmailAccountConfigType.API:
        this.fetchEmailsViaApi(config);
        break;
      case EmailAccountConfigType.OAUTH:
        this.fetchEmailsViaOauth(config);
        break;
      default:
        throw new Error('Unsupported email config type');
    }
  }

  // Handle fetching emails via IMAP
  private async fetchEmailsViaImap(
    config: EmailAccountEntity,
    user: IJwtUserPayload,
  ): Promise<void> {
    this.logger.log(
      `EMAIL FETCHER : Attempting to fetch emails via IMAP for user: ${user.email}`,
    );

    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: config.imapUsername,
        password: config.imapPassword,
        host: config.imapHost,
        port: config.imapPort,
        tls: config.imapSecure,
      });

      imap.once('ready', () => {
        this.logger.log(
          'EMAIL FETCHER : IMAP connection ready. Opening INBOX.',
        );
        imap.openBox(BoxTypes.INBOX, true, (err, box) => {
          const unreadEmails = box.messages.unseen;
          if (err) {
            this.logger.error(
              `EMAIL FETCHER : Error opening INBOX: ${err.message}`,
              err.stack,
            );
            imap.end();
            return reject(err);
          }

          if (unreadEmails === 0) {
            this.logger.log(
              `EMAIL FETCHER : No unread emails found in ${box.name}.`,
            );
            imap.end();
            return resolve();
          }

          this.logger.log(
            `EMAIL FETCHER : INBOX opened. Searching for ${unreadEmails} unseen emails.`,
          );

          imap.search(['UNSEEN'], (err, results) => {
            if (err) {
              this.logger.error(
                `EMAIL FETCHER : Error searching for emails: ${err.message}`,
                err.stack,
              );

              imap.end();
              return reject(err);
            }

            this.logger.log(
              `EMAIL FETCHER : Found ${results?.length || 0} unread emails.`,
            );
            if (!results?.length) {
              imap.end();
              return resolve();
            }

            const fetch = imap.fetch(results, { bodies: '' });
            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                void (async () => {
                  try {
                    const parsed: ParsedMail = await simpleParser(
                      stream as unknown as Source,
                    );
                    const messagePayload = this.getRelevantEmailData(parsed);
                    await this.sendEmailToQueue(messagePayload, user);
                    this.logger.log(
                      `EMAIL FETCHER : Email from ${messagePayload.from?.address} added to queue.`,
                    );
                  } catch (parseErr) {
                    const error = parseErr as Error;
                    this.logger.error(
                      `EMAIL FETCHER : Error parsing email: ${error.message}`,
                      error.stack,
                    );
                    return;
                  }
                })();
              });
            });

            fetch.once('end', () => {
              this.logger.log('EMAIL FETCHER : Finished fetching messages.');
              imap.end();
            });
          });
        });
      });

      imap.once('error', (err: Error) => {
        this.logger.error(
          `EMAIL FETCHER : IMAP connection error: ${err.message}`,
          err.stack,
        );
        reject(err);
      });

      imap.once('end', () => {
        this.logger.log('EMAIL FETCHER : IMAP connection ended.');
        resolve(); // Resolve when connection ends (after all operations or on error)
      });

      imap.connect();
    });
  }

  private fetchEmailsViaApi(config: EmailAccountEntity) {
    this.logger.log(
      'EMAIL FETCHER : Fetching emails via API (e.g., Gmail API)',
      config,
    );
  }

  private fetchEmailsViaOauth(config: EmailAccountEntity) {
    this.logger.log('EMAIL FETCHER : Fetching emails via OAuth', config);
  }

  private sendEmailToQueue(
    message: EmailMessageDto,
    user: IJwtUserPayload, // User context for the queue
  ) {
    this.logger.log(
      `EMAIL FETCHER : Adding email to queue: ${message.subject} from ${message.from?.address}`,
    );
    return this.emailQueueService.addEmailToQueue({ message, user });
  }

  private getRelevantEmailData(parsedEmail: ParsedMail): EmailMessageDto {
    const emailData: EmailMessageDto = {
      from: this.getEmailFromValues(parsedEmail.from),
      to: this.getEmailFromValues(parsedEmail.to as AddressObject),
      subject: parsedEmail.subject || '',
      date: parsedEmail.date?.toISOString() || '',
      text: parsedEmail.text || '',
      textAsHtml: parsedEmail.textAsHtml || '',
      messageId: parsedEmail.messageId || '',
      // Ensure other relevant fields are mapped if needed
    };

    this.logger.log(
      `EMAIL FETCHER : Parsed email data: ${JSON.stringify(emailData.from)}`,
      emailData,
    );

    return emailData;
  }

  private getEmailFromValues(data?: AddressObject): EmailAddress {
    try {
      if (!data?.value || data.value.length === 0) {
        throw new Error('No email address found in value array');
      }
      // Return the first email address found
      return data.value[0];
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `EMAIL FETCHER : Error getting email from values: ${errorMessage}`,
        {
          text: data?.text,
          value: data?.value,
          error,
        },
      );
      throw new Error('Failed to get email from values');
    }
  }
}
