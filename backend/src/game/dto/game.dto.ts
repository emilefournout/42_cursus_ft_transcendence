import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @IsInt()
  userid_1: number;
  
  @ApiProperty()
  @IsInt()
  userid_2: number;
}
