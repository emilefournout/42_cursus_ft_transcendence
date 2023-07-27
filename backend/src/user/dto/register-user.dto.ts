import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username to register, can be different than the intraname.'
  })
  username: string;

  @IsOptional()
  @ApiProperty({
    description: 'Possible image to upload as profile avatar.'
  })
  image?: any;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Two factor authentication code.',
    required: false
  })
  code2fa: string;
}
