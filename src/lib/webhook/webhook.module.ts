import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
