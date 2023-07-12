import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class UpdateUserRelationDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  id: number
  @IsBoolean()
  @IsDefined()
  @IsNotEmpty()
  add: boolean
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserRelationDto)
  friend?: UpdateUserRelationDto
  
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserRelationDto)
  blocked?: UpdateUserRelationDto
}
