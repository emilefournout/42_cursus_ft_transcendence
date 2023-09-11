import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  code2fa?: string;
}
