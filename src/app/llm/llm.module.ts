import { Module } from '@nestjs/common';
import LLMService from './llm.service';
import { CustomLoggerModule } from 'src/lib/logger/logger.module';

@Module({
  imports: [],
  providers: [LLMService],
  exports: [LLMService], // Export if you need to use it in other modules
})
export class LLMModule {}
