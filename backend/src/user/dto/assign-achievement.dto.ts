import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IsValidUserId } from '../validators/user-valid-id.decorator';

export class AssignAchievementDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  @IsValidUserId()
  id: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  achievementName: string;
}
