import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import UsersController from './user.controller';
import { CompanyEntity } from 'src/entities';
import { LoggerModule } from 'src/lib/logger/logger.module';
import {
  EmailAccountController,
  EmailAccountEntity,
  EmailAccountService,
} from '../accountConfig';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailAccountEntity, CompanyEntity]),
    LoggerModule,
  ],
  providers: [UserService, EmailAccountService],
  controllers: [UsersController, EmailAccountController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
