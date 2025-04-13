import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { EmailAccountService } from './email-account.service';
import {
  SyncEmailImapAccountDto,
  CreateImapConfigDto,
  EmailAccountDtoUnionWrapper,
} from './dtos/email-account.dto';
import { ApiBody } from '@nestjs/swagger';
import { IJwtUserPayload } from '../user/dtos/user.dto';
import { UserInfo } from '../../lib/decorators/user.auth.decorator';
import { SanitizeInterceptor } from 'src/lib/interceptors/sanitize.interceptor';

@UseInterceptors(SanitizeInterceptor)
@Controller('user/email-config')
export class EmailAccountController {
  constructor(private readonly emailConfigService: EmailAccountService) {}

  @ApiBody({ type: EmailAccountDtoUnionWrapper })
  @Post('imap')
  async createImapConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Body() configDto: CreateImapConfigDto,
  ) {
    return await this.emailConfigService.createConfig(userInfo.id, configDto);
  }

  @ApiBody({ type: SyncEmailImapAccountDto })
  @Post('imap/sync')
  async syncImapConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Body() syncConfigDto: SyncEmailImapAccountDto,
  ) {
    return await this.emailConfigService.syncImapConfig(
      userInfo.id,
      syncConfigDto.configId,
    );
  }

  @ApiBody({ type: EmailAccountDtoUnionWrapper })
  @Patch('imap/:configId')
  async updateImapConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Param('configId') configId: string,
    @Body() configDto: CreateImapConfigDto,
  ) {
    return await this.emailConfigService.updateConfig(
      userInfo.id,
      configId,
      configDto,
    );
  }

  @Get()
  async getConfigsByUser(@UserInfo() userInfo: IJwtUserPayload) {
    return await this.emailConfigService.getConfigsByUser(userInfo.id);
  }

  @ApiBody({ type: EmailAccountDtoUnionWrapper })
  @Patch(':configId')
  async updateConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Param('configId') configId: string,
    @Body() configDto: CreateImapConfigDto,
  ) {
    return await this.emailConfigService.updateConfig(
      userInfo.id,
      configId,
      configDto,
    );
  }

  @Delete(':configId')
  async deleteConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Param('configId') configId: string,
  ) {
    return await this.emailConfigService.deleteConfig(configId, userInfo.id);
  }
}
