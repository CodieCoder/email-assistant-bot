import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from 'src/lib/decorators/user.auth.decorator';
import { IJwtUserPayload } from './dtos/user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:userId')
  async getUsers(
    @UserInfo() userInfo: IJwtUserPayload,
    @Param('userId') userId: string,
  ) {
    if (userInfo.id !== userId) {
      throw new BadRequestException('Invalid access');
    }

    return await this.userService.findOneById(userInfo.id);
  }
}
