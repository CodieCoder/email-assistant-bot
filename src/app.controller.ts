import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailMessageDto } from './app/message';
import { GetUserFromRequest } from './app/auth';
import { IJwtUserPayload } from './app/user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/testMessage')
  async testMessage(
    @GetUserFromRequest() userInfo: IJwtUserPayload,
    @Body() emailMessage: EmailMessageDto,
  ) {
    return await this.appService.testMessage(emailMessage, userInfo);
  }
}
