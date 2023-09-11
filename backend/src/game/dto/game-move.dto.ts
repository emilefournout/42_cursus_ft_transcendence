import { IsDefined, IsIn, IsString, IsUUID } from 'class-validator';

export class GameMoveDto {
  @IsDefined()
  @IsUUID()
  gameId: string;

  @IsDefined()
  @IsString()
  @IsIn(['down', 'up'])
  direction: string;
}
