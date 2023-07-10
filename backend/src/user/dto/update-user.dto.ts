import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
