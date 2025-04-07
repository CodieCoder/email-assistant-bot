import { Module } from '@nestjs/common';
import SenderService from './sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderEntity } from './entities/sender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SenderEntity])],
  providers: [SenderService],
  exports: [SenderService, TypeOrmModule],
  //   providers: [],
})
class SenderModule {}

export default SenderModule;
