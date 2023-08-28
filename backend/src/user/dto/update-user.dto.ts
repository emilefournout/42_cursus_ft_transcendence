import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username?: string
  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  wins?: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  loses?: number
}
