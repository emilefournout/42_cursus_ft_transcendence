import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  image;

  @IsString()
  code2fa: string;
}
