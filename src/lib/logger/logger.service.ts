import { ConsoleLogger, Logger, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ILoggerDto } from './logger.dto';

export class CustomLoggerService
  extends ConsoleLogger
  implements LoggerService
{
  private logFilePath: string;
  private externalLogServiceUrl: string;

  constructor(
    logFileName: string = 'app.log',
    externalServiceUrl: string = '',
  ) {
    super();
    this.logFilePath = path.join(__dirname, logFileName);
    this.externalLogServiceUrl = externalServiceUrl;
  }

  private writeToFile(message: string): void {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage, { encoding: 'utf8' });
  }

  // private async sendToExternalService(
  //   level: string,
  //   message: string,
  //   context?: string,
  // ) {
  //   if (this.externalLogServiceUrl) {
  //     try {
  //       await axios.post(this.externalLogServiceUrl, {
  //         level,
  //         message,
  //         context,
  //         timestamp: new Date().toISOString(),
  //       });
  //     } catch (error) {
  //       super.error('Failed to send log to external service:', error);
  //     }
  //   }
  // }

  log({ message, context }: ILoggerDto) {
    super.log(message, context);
    this.writeToFile(`[LOG] ${context ? '[' + context + '] ' : ''}${message}`);
    // this.sendToExternalService('log', message, context);
  }

  error({ message, context, trace }: ILoggerDto) {
    super.error(message, trace, context);
    this.writeToFile(
      `[ERROR] ${context ? '[' + context + '] ' : ''}${message || ''}\nTrace: ${trace || 'N/A'}`,
    );
    // this.sendToExternalService('error', message, context);
  }

  warn({ message, context }: ILoggerDto) {
    super.warn(message, context);
    this.writeToFile(`[WARN] ${context ? '[' + context + '] ' : ''}${message}`);
    // this.sendToExternalService('warn', message, context);
  }
}
