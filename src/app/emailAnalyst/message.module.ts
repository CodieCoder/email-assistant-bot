import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { CompanyEntity } from 'src/entities';
import SenderModule from '../sender/sender.module';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, CompanyEntity, UserEntity]),
    SenderModule,
    LLMModule,
    // UserModule,
  ],
  providers: [MessageService, UserService],
  exports: [
    MessageService,
    //  TypeOrmModule
  ],
})
export class MessageModule {}
