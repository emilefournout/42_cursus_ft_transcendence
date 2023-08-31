import { Socket } from 'socket.io';

export class GameState {
  private gameId: string;
  private player1: {
    socket: Socket;
    id: number;
  };
  private player2: {
    socket: Socket;
    id: number;
  };
  private maxGoals: number;
  private finished: boolean;
  constructor(
    id: string,
    player1: { socket: Socket; id: number },
    player2: { socket: Socket; id: number }
  ) {
    this.gameId = id;
    this.player1 = player1;
    this.player2 = player2;
    this.finished = false;
    this.maxGoals = 3;
  }

  public finish() {}

  public get id(): string {
    return this.gameId;
  }

  public get goalsLimit(): number {
    return this.maxGoals;
  }

  public get firstPlayer(): {
    socket: Socket;
    id: number;
  } {
    return this.player1;
  }

  public get secondPlayer(): {
    socket: Socket;
    id: number;
  } {
    return this.player2;
  }

  public get isFinished(): boolean {
    return this.finished;
  }
}
