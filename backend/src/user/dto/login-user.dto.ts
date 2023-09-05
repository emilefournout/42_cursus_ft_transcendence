import { IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  code2fa?: string;
}
