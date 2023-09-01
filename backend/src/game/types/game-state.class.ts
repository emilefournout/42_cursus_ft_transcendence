import { Socket } from 'socket.io';
import { GameData, GameDataOptions } from './game-info.class';

export class GameState {
  private gameId: string;
  private gameData: GameData;
  private player1 : { socket: Socket; id: number };
  private player2 : { socket: Socket; id: number };
  
  constructor(
    id: string,
    player1: { socket: Socket; id: number },
    player2: { socket: Socket; id: number },
    gameDataOptions: GameDataOptions
  ) {
    this.gameId = id;
    this.player1 = player1;
    this.player2 = player2;
    this.gameData = new GameData(player1.id, player2.id, gameDataOptions);
  }

  public finish() {
    this.gameData.finish()
  }

  public get id(): string {
    return this.gameId;
  }

  public get firstPlayer(): { socket: Socket; id: number }
  {
    return this.player1;
  }

  public get secondPlayer(): { socket: Socket; id: number }
  {
    return this.player2;
  }

  public get winnerId(): number
  {
    return this.gameData.winner;
  }


  public get goalsLimit(): number
  {
    return this.gameData.goalsLimit;
  }

  public get firstPlayerScore() : number {
    return this.gameData.firstPlayerScore
  }
  
  public get secondPlayerScore() : number {
    return this.gameData.secondPlayerScore
  }


  public get loserId(): number
  {
    return this.gameData.loser;
  }

  public get isFinished(): boolean {
    return this.gameData.isFinished;
  }

  public get info(): GameData {
    return this.gameData;
  }
}
