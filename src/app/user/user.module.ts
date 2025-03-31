import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import UsersController from './user.controller';
import { CompanyEntity } from 'src/entities';
import { LoggerModule } from 'src/lib/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      //   MessageEntity,
      //   // SenderEntity,
      CompanyEntity,
    ]),
    LoggerModule,
  ],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService, TypeOrmModule],
})
class UserModule {}
// export class UserModule {}

export default UserModule;
