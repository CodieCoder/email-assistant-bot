import { Module } from '@nestjs/common';
import LLMService from './llm.service';

@Module({
  providers: [LLMService],
  exports: [LLMService], // Export if you need to use it in other modules
})
export class LLMModule {}
