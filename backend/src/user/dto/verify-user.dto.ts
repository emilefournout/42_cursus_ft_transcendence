import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString
} from 'class-validator';

export class VerifyUserDto {
  @IsDefined()
  @IsInt()
  id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  code: string;
}
