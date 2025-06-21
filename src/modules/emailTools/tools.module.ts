import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';

@Module({
  imports: [],
  providers: [],
  exports: [ToolsService],
})
export class ToolsModule {}
