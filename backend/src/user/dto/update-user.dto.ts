import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateUserRelationDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  id: number
}

export class UpdateUserDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  username: string
}
