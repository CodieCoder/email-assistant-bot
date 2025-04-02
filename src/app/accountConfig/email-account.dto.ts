import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UserEmailAccountConfigDto {
  @ApiProperty({
    description: 'Authentication token for the email account',
    example: 'auth-token-123',
  })
  @IsOptional()
  @IsString()
  authToken?: string;

  @ApiProperty({
    description: 'API key for the email account',
    example: 'api-key-123',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({
    description: 'IMAP host for the email account',
    example: 'imap.gmail.com',
  })
  @IsOptional()
  @IsString()
  imapHost?: string;

  @ApiProperty({ description: 'IMAP port for the email account', example: 993 })
  @IsOptional()
  @IsNumber()
  imapPort?: number;

  @ApiProperty({
    description: 'IMAP username for the email account',
    example: 'user@gmail.com',
  })
  @IsOptional()
  @IsString()
  imapUsername?: string;

  @ApiProperty({
    description: 'IMAP password for the email account',
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  imapPassword?: string;

  @ApiProperty({ description: 'Whether to use SSL for IMAP', example: true })
  @IsOptional()
  @IsBoolean()
  imapUseSSL?: boolean;

  @ApiProperty({ description: 'Email provider', example: 'Gmail' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Description of the email account',
    example: 'Personal Gmail account',
  })
  @IsOptional()
  @IsString()
  description?: UserEmailAccountConfigDto;
}
