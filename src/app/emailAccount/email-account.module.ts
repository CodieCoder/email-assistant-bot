import { Module } from '@nestjs/common';
import { EmailAccountService } from './email-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAccountEntity } from './entities/email-account.entity';
import { EmailAccountController } from './email-account.controller';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { EmailReceivingModule } from '../emailReceiving/email-receiving.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAccountEntity, UserEntity]),
    UserModule,
    EmailReceivingModule,
  ],
  controllers: [EmailAccountController],
  providers: [UserService, EmailAccountService],
  exports: [EmailAccountService],
})
export class EmailAccountModule {}
