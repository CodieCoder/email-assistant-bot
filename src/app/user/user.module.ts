import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { CompanyEntity } from 'src/entities';

import { CustomLoggerModule } from '../../lib/logger/logger.module';
import { EmailAccountService } from '../emailAccount/email-account.service';
import { EmailAccountController } from '../emailAccount/email-account.controller';
import { CustomLoggerService } from '../../lib/logger/logger.service';
import { EmailAccountEntity } from '../emailAccount/entities/email-account.entity';
import { EmailReceivingService } from '../emailReceiving/email-receiving.service';
import { EmailQueueService } from '../queue/email-queue.service';
import { EmailQueueModule } from '../queue/queue.module';
import { TelegramController } from '../telegram/telegram.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailAccountEntity, CompanyEntity]),
    EmailQueueModule,
    // CustomLoggerModule,
  ],
  providers: [
    EmailAccountService,
    UserService,
    EmailReceivingService,

    //  CustomLoggerService
  ],
  controllers: [UsersController, EmailAccountController, TelegramController],
  exports: [UserService],
})
export class UserModule {}
