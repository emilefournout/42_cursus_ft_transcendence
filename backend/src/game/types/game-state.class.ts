import { Socket } from 'socket.io';
import { GameData } from './game-info.class';

export class GameState {
  private gameId: string;
  private gameState: GameData;
  private player1 : { socket: Socket; id: number };
  private player2 : { socket: Socket; id: number };
  
  constructor(
    id: string,
    player1: { socket: Socket; id: number },
    player2: { socket: Socket; id: number }
  ) {
    this.gameId = id;
    this.player1 = player1;
    this.player2 = player2;
    this.gameState = new GameData(player1.id, player2.id)
  }

  public finish() {
    this.gameState.finish()
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
    return this.gameState.winner;
  }


  public get goalsLimit(): number
  {
    return this.gameState.goalsLimit;
  }

  public get firstPlayerScore() : number {
    return this.gameState.firstPlayerScore
  }
  
  public get secondPlayerScore() : number {
    return this.gameState.secondPlayerScore
  }


  public get loserId(): number
  {
    return this.gameState.loser;
  }

  public get isFinished(): boolean {
    return this.gameState.isFinished;
  }
}
