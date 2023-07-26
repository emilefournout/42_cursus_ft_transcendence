import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateUserRelationDto {
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  targetId: number
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  username: string
}
