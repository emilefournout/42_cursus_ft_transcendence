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
  username: string;

  @IsOptional()
  image;

  @IsString()
  @IsOptional()
  code2fa: string;
}
