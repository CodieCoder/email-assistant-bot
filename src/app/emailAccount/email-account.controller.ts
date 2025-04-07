import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { EmailAccountService } from './email-account.service';
import {
  ActivateEmailImapAccountDto,
  CreateImapConfigDto,
  EmailAccountDtoUnionWrapper,
} from './dtos/email-account.dto';
import { ApiBody, ApiOAuth2 } from '@nestjs/swagger';
import { IJwtUserPayload } from '../user/dtos/user.dto';
import { UserInfo } from '../../lib/decorators/user.auth.decorator';

@Controller('email-config')
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

  @ApiBody({ type: ActivateEmailImapAccountDto })
  @Post('imap/activate')
  async activateImapConfig(
    @UserInfo() userInfo: IJwtUserPayload,
    @Body() activateConfigDto: ActivateEmailImapAccountDto,
  ) {
    return await this.emailConfigService.activateImapConfig(
      userInfo.id,
      activateConfigDto.configId,
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
