import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import SenderModule from '../sender/sender.module';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LLMModule } from '../llm/llm.module';
import { MessageUserCrudController } from './userCrud.message.controller';
import { UserCrudMessageService } from './userCrud.message.service';
import { DomainEntity } from '../domain/domain.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, DomainEntity, UserEntity]),
    SenderModule,
    LLMModule,
  ],
  providers: [Logger, MessageService, UserService, UserCrudMessageService],
  controllers: [MessageUserCrudController],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
