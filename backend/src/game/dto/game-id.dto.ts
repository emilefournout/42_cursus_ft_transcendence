import { IsDefined, IsUUID } from 'class-validator';

export class GameIdDto {
  @IsDefined()
  @IsUUID()
  gameId: string;
}
