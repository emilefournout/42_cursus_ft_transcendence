import { IsInt } from 'class-validator';

export class CreateGameDto {
  @IsInt()
  userid_1: number;

  @IsInt()
  userid_2: number;
}
