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
  @IsInt()
  @ApiProperty()
  user_id: number;

  @IsDefined()
  @IsEnum(ChatVisibility)
  @ApiProperty({ enum: ChatVisibility })
  chatVisibility: ChatVisibility;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String
  })
  password?: string;
}
