import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class RegisterUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  code2fa: string;
}
