import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateGameDto {
  @IsDefined()
  @IsNumber()
  @Min(5)
  @Max(25)
  maxGoals: number;

  @IsDefined()
  @IsNumber()
  @IsBoolean()
  powerUps: boolean;

  @IsDefined()
  @IsNumber()
  @Min(0.75)
  @Max(1.25)
  speed: number;

  @IsDefined()
  @IsString()
  @IsIn(['classic', 'mad', 'pastel', 'red', 'gboy'])
  color: string;
}

export class CreatePrivateGameDto {
  @IsDefined()
  @ValidateNested()
  gameDto: CreateGameDto;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform((name: TransformFnParams) => (name.value as string).toLowerCase())
  friendUserName: string;
}
