import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { EmailAccountEntity } from '../emailAccount/entities/email-account.entity';
import { TelegramAccountEntity } from '../telegram/entities/telegram.entity';
import { DomainEntity } from '../domain/domain.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmailAccountEntity,
      DomainEntity,
      TelegramAccountEntity,
    ]),
  ],
  providers: [Logger, UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
