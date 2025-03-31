import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/app/message';
import { MessageService } from './message.service';
import { CompanyEntity } from 'src/entities';
import UserModule from '../user/user.module';
import SenderModule from '../sender/sender.module';
import { LLMModule } from '../llm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, CompanyEntity]),
    SenderModule,
    LLMModule,
    UserModule,
  ],
  providers: [MessageService],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
