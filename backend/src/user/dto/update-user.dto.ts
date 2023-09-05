import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateUserRelationDto {
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(2)
  targetId: number;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;
}
