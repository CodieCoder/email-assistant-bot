import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EmailAccountService } from './email-account.service';
import { UserEmailAccountConfigDto } from './email-account.dto';
import { UserInfo } from '../auth';
import { IJwtUserPayload } from '../user';

@Controller('user/email-configs')
export class EmailAccountController {
  constructor(private readonly emailConfigService: EmailAccountService) {}

  @Post(':userId')
  async createConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Body() configDto: UserEmailAccountConfigDto,
  ) {
    return await this.emailConfigService.createConfig(userInfo.id, configDto);
  }

  @Get(':userId')
  async getConfigsByUser(@UserInfo() userInfo: IJwtUserPayload) {
    return await this.emailConfigService.getConfigsByUser(userInfo.id);
  }

  @Put(':configId')
  async updateConfig(
    @Param('configId') configId: string,
    @Body() configDto: UserEmailAccountConfigDto,
  ) {
    return await this.emailConfigService.updateConfig(configId, configDto);
  }

  @Delete(':configId')
  async deleteConfig(@Param('configId') configId: string) {
    return await this.emailConfigService.deleteConfig(configId);
  }
}
