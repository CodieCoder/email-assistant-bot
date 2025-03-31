import { Module } from '@nestjs/common';
import { SenderEntity } from 'src/app/sender';
import SenderService from './sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SenderEntity])],
  providers: [SenderService],
  exports: [SenderService, TypeOrmModule],
  //   providers: [],
})
class SenderModule {}

export default SenderModule;
