import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  summary: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface UserCreatedDto extends UserDto {
  verificationToken: string;
  isEmailVerified: boolean;
}

export interface UserCreateResponseDto {
  status: boolean;
  message: string;
}

export enum UserTypeEnum {
  Personal = 'personal',
  Work = 'Work',
}

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserTypeEnum)
  emailType: UserTypeEnum;

  @IsString()
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class UserUpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

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
  user: UserDto;
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
