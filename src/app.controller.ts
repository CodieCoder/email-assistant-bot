import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailMessageDto } from './lib/dtos';
import { UserInfo } from './lib/decorators/user.auth.decorator';
import { IJwtUserPayload } from './app/user/dtos/user.dto';
import { Public } from './app/auth/public';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/testMessage')
  async testMessage(
    @UserInfo() userInfo: IJwtUserPayload,
    @Body() emailMessage: EmailMessageDto,
  ) {
    return await this.appService.testMessage(emailMessage, userInfo);
  }
}
