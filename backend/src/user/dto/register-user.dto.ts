import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Username to register, can be different than the intraname.'
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Two factor authentication code.',
    required: false
  })
  @IsString()
  @IsOptional()
  code2fa: string;
}
