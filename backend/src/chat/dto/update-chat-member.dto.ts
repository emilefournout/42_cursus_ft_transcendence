import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class ChatRoleDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  owner?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  administrator?: boolean;
}

export class UpdateChatMemberDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsDefined()
  @IsObject()
  @Type(() => ChatRoleDto)
  @IsNotEmpty()
  role: ChatRoleDto;
}
