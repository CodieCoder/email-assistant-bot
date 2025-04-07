import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Public } from './public';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IUserAuthResponse,
  UserCreateDto,
  UserCreateResponseDto,
  UserLoginDto,
} from '../user/dtos/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() userDto: UserLoginDto): Promise<IUserAuthResponse> {
    try {
      return await this.authService.login(userDto);
    } catch (error) {
      throw new BadRequestException(error, { description: 'Unable to login' });
    }
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
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
