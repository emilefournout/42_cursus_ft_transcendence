import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatVisibility } from '@prisma/client';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateChatDto {
  @IsDefined()
  @IsEnum(ChatVisibility)
  @ApiProperty({ enum: ChatVisibility })
  chatVisibility: ChatVisibility;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String
  })
  password?: string;
}
