import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsDefined()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsDefined()
  @IsEnum(ChatVisibility)
  chatVisibility: ChatVisibility;

  @ApiProperty()
  @IsOptional()
  password?: string;
}
