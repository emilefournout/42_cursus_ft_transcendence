import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChatMemberDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
  })
  password?: string;
}
