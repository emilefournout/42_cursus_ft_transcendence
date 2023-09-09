import { IsDefined, IsString, IsUUID } from 'class-validator';

export class GameIdDto {
  @IsDefined()
  @IsString()
  @IsUUID()
  gameId: string;
}
