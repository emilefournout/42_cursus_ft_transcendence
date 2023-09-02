import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Min
} from 'class-validator';

export class VerifyUserDto {
  @IsDefined()
  @IsInt()
  @Min(2)
  id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  code: string;
}
