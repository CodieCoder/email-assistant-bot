import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import POSTGRES_DB_CONFIG from './config/database/postgres.config.database';

@Module({
  imports: [TypeOrmModule.forRoot({ ...POSTGRES_DB_CONFIG })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
