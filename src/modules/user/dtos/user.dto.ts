import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  summary: string;
  description: string;
  activeConfigId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  accountType: UserAccountTypeEnum;
}

export interface UserCreatedDto extends UserDto {
  verificationToken: string;
  isEmailVerified: boolean;
}

export class UserCreateResponseDto {
  @ApiProperty({
    description: 'Status of the registration (true/false)',
    example: 'true',
  })
  status: boolean;

  @ApiProperty({
    description: 'The message associated with the registration',
    example: 'User created successfully',
  })
  message: string;
}

export enum UserAccountTypeEnum {
  Personal = 'personal',
  Work = 'work',
}

export class UserLoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;
}

export class UserCreateDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  @ApiProperty({
    description: 'The password of the user',
    example: 'passwordAA123$',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @IsOptional()
  summary: string;

  @IsOptional()
  description: string;

  @IsEnum(UserAccountTypeEnum)
  @ApiProperty({
    description: 'The account type of the user',
    example: 'personal',
    enum: UserAccountTypeEnum,
  })
  accountType: UserAccountTypeEnum;
}

export class UserUpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  summary: string;

  @IsString()
  description: string;
}

export class UserDeleteDto {
  @IsEmail()
  email: string;
}

export interface IUserAuthResponse {
  user: Partial<UserDto>;
  accessToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface IJwtUserPayload {
  id: string;
  email: string;
}
