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
  user_id: number;

  @IsDefined()
  @IsEnum(ChatVisibility)
  chatVisibility: ChatVisibility;

  @IsOptional()
  password?: string;
}
