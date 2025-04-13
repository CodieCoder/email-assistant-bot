import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateTelegramAccountDto } from './dtos/telegram.dto';
import { UserInfo } from 'src/lib/decorators/user.auth.decorator';
import { IJwtUserPayload } from '../user/dtos/user.dto';
import { TelegramAccountEntity } from './entities/telegram.entity';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async addTelegramAccount(
    @UserInfo() user: IJwtUserPayload,
    @Body() dto: CreateTelegramAccountDto,
  ): Promise<TelegramAccountEntity> {
    return this.telegramService.add(user.id, dto);
  }

  @Patch(':id')
  async updateTelegramAccount(
    @UserInfo() user: IJwtUserPayload,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTelegramAccountDto>,
  ): Promise<TelegramAccountEntity> {
    return this.telegramService.update(id, dto);
  }

  @Get()
  async getTelegramAccount(
    @UserInfo() user: IJwtUserPayload,
  ): Promise<TelegramAccountEntity[]> {
    return this.telegramService.findAll(user.id);
  }
}
