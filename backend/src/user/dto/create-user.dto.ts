import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  isString
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;
}
