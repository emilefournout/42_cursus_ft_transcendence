import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidUserId } from 'src/user/validators/user-valid-id.decorator';

export class CreateChatMemberDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty()
  @IsValidUserId()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
  })
  password?: string;
}
