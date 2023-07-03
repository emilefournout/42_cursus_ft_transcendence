import { Injectable } from '@nestjs/common';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  findGameById(id: number): Game {
    return null;
  }
}
