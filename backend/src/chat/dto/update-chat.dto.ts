import {ApiPropertyOptional} from '@nestjs/swagger';
import {ChatVisibility} from '@prisma/client';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ChatVisibility)
  @ApiPropertyOptional()
  chatVisibility?: ChatVisibility;
}
