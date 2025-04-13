import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUrl,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export enum EmailAccountConfigType {
  IMAP = 'imap',
  API = 'api',
  OAUTH = 'oauth',
}

export enum EmailAccountProvider {
  GMAIL = 'Gmail',
  OUTLOOK = 'Outlook',
  YAHOO = 'Yahoo',
  ZOHO = 'Zoho',
  OTHER = 'Other',
}

class BaseEmailConfigDto {
  @ApiProperty({
    enum: EmailAccountConfigType,
    example: EmailAccountConfigType.IMAP,
  })
  @IsEnum(EmailAccountConfigType)
  configType: EmailAccountConfigType;

  @ApiProperty({
    enum: EmailAccountProvider,
    example: EmailAccountProvider.GMAIL,
  })
  @IsEnum(EmailAccountProvider)
  provider: EmailAccountProvider;

  @ApiProperty({ example: 'My personal Gmail config' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateImapConfigDto extends BaseEmailConfigDto {
  @ApiProperty({ example: 'imap.gmail.com' })
  @IsUrl()
  imapHost: string;

  @ApiProperty({ example: 993 })
  @IsNumber()
  imapPort: number;

  @ApiProperty({ example: 'me@gmail.com' })
  @IsEmail()
  imapUsername: string;

  @ApiProperty({ example: 'app-password-or-token' })
  @IsString()
  imapPassword: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  imapSecure: boolean;
}

export class CreateApiConfigDto extends BaseEmailConfigDto {
  @ApiProperty({ example: 'api-key-xyz' })
  @IsString()
  apiKey: string;
}

export class CreateOauthConfigDto extends BaseEmailConfigDto {
  @ApiProperty({ example: 'ya29.A0ARrdaM...etc' })
  @IsString()
  authToken: string;

  @ApiProperty({ example: 'refresh-token-xyz' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export type CreateEmailAccountDto =
  | CreateImapConfigDto
  | CreateApiConfigDto
  | CreateOauthConfigDto;

@ApiExtraModels(CreateImapConfigDto, CreateApiConfigDto, CreateOauthConfigDto)
export class EmailAccountDtoUnionWrapper {}

export class SyncEmailImapAccountDto {
  @IsString()
  @IsNotEmpty()
  configId: string;
}
