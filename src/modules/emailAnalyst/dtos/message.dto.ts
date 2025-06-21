import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IAITagReportObject } from 'src/modules/llm/dtos/llm.dto';
import { SenderDto } from 'src/modules/sender/dtos/sender.dto';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { DomainDto } from 'src/lib/dtos/domain.dto';
import { BaseEntity } from 'src/lib/entity/entity.base';

export interface IMessageContext {
  senderSummary?: string;
  domainSummary?: string;
  recentMessages?: {
    description: string;
    summary: string;
  }[];
}

export interface MessageDto {
  emailId: string;
  subject: string;
  isProcessed: boolean;
  summary: string;
  description: string;
  tags: IAITagReportObject;
  domain: DomainDto;
  domainId: string;
  sender: SenderDto;
  senderId: string;
  user: UserDto;
  userId: string;
}

export class MessageDtoClass extends BaseEntity {
  @ApiProperty({
    description: 'Original Message-ID from the email header',
    example: '<CAG=+=_cK_6Qkr_Guk=F=9qX9_vOW=G@mail.gmail.com>',
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @ApiPropertyOptional({
    description: 'Subject of the message',
    example: 'Meeting Request',
  })
  @IsOptional()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Flag indicating if AI processing is complete',
    example: true,
  })
  @IsBoolean()
  isProcessed: boolean;

  @ApiPropertyOptional({
    description: 'AI-generated summary of the message',
    example: 'Request to schedule a meeting next week.',
  })
  @IsOptional()
  @IsString()
  summary: string;

  @ApiPropertyOptional({
    description: 'AI-generated description or potentially full text',
    example: 'Detailed discussion points for the upcoming meeting...',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'AI-analyzed tags and confidence scores',
    type: () => Object,
  })
  @IsOptional()
  @IsObject()
  tags: IAITagReportObject;

  @ApiProperty({
    description: 'Associated domain details',
    type: () => Object,
  })
  @IsOptional()
  @IsObject()
  domain: DomainDto;

  @ApiProperty({
    description: 'UUID of the associated domain',
    example: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
  })
  @IsOptional()
  @IsUUID()
  domainId: string;

  @ApiProperty({
    description: 'Associated sender details',
    type: () => Object,
  })
  @IsOptional()
  @IsObject()
  sender: SenderDto;

  @ApiProperty({
    description: 'UUID of the associated sender',
    example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
  })
  @IsOptional()
  @IsUUID()
  senderId: string;

  @ApiProperty({ description: 'Associated user details', type: () => Object })
  @IsObject()
  user: UserDto;

  @ApiProperty({
    description: 'UUID of the associated user',
    example: 'd4e5f6a7-b8c9-0123-4567-890abcdef012',
  })
  @IsUUID()
  userId: string;
}
