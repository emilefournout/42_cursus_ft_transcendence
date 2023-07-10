import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDefined()
  @IsEmail()
  @IsString()
  email: string;

  // @IsOptional()
  avatar?: File;
}
