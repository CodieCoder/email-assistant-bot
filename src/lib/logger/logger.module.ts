import { Logger, Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';

@Module({
  providers: [Logger, CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
