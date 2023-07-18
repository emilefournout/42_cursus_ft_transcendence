import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  isString
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  intraname: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsOptional()
  avatar?: File;
}
