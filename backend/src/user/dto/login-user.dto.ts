import {
  IsDefined,
  IsNotEmpty,
  IsString
} from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  code2fa: string
}
