import { GameDataOptions } from './game-data.class';

export class Pair {
  constructor(public gameData: GameDataOptions, public invitedId: number) {
    this.gameData = gameData;
    this.invitedId = invitedId;
  }
}
