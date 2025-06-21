import { Logger, Module } from '@nestjs/common';
import LLMService from './llm.service';

@Module({
  imports: [],
  providers: [LLMService, Logger],
  exports: [LLMService], // Export if you need to use it in other modules
})
export class LLMModule {}
