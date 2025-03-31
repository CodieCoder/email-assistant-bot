import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  IUserAuthResponse,
  UserCreateDto,
  UserCreateResponseDto,
  UserLoginDto,
} from '../user';
import { Public } from './public';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userDto: UserLoginDto): Promise<IUserAuthResponse> {
    try {
      return await this.authService.login(userDto);
    } catch (error) {
      throw new BadRequestException(error, { description: 'Unable to login' });
    }
  }

  @Post('register')
  @Public()
  async register(
    @Body() userDto: UserCreateDto,
  ): Promise<UserCreateResponseDto> {
    try {
      return await this.authService.register(userDto);
    } catch (error) {
      throw new BadRequestException(error, {
        description: 'Unable to register user',
      });
    }
  }
}

export default AuthController;
