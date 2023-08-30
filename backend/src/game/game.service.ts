import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGameData } from './types/game.interface';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';
import { UpdateGameDto } from './dto/updte-game.dto';
import { AchievementService } from 'src/achievement/achievement.service';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: number;
  };
}

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
  constructor(id: string, player1: { socket: Socket; id: number; }, player2: { socket: Socket; id: number; })
  {
    this.gameId = id;
    this.player1 = player1
    this.player2 = player2
    this.finished = false
    this.maxGoals = 3
  }

  public finish() {
  }
  

  public get id() :  string{
    return this.gameId;
  }

  public get goalsLimit() :  number{
    return this.maxGoals;
  }

  public get firstPlayer() :  {
    socket: Socket;
    id: number;
  } {
    return this.player1;
  }

  public get secondPlayer() :  {
    socket: Socket;
    id: number;
  } {
    return this.player2;
  }

  public get isFinished() :  boolean {
    return this.finished;
  }
  
};

@Injectable()
export class GameService {
  initState: IGameData = {
    player1Id: 0,
    player2Id: 0,
    maxGoals: 3,
    width: 600,
    height: 350,
    padWidth: 10,
    padHeight: 60,
    ballRadius: 8,
    leftPad: 0,
    rightPad: 150,
    ballX: 200,
    ballY: 150,
    padVelocity: 30,
    velocityX: Math.random() + 3,
    velocityY: Math.random() + 3,
    padWallSeparation: 20,
    player1Score: 0,
    player2Score: 0
  };
  private waitingRoom: Set<Socket> = new Set();
  private games = new Map<string, IGameData>();
  private clientsConnections: ConnectedClients = {};

  constructor(private prisma: PrismaService) {}

  findActiveGames(): string[] {
    return Array.from(this.games.keys());
  }

  findActiveGameByUserId(userId: number): string | undefined {
    for (const [gameId, gameData] of this.games.entries()) {
      if (gameData.player1Id == userId
        || gameData.player2Id == userId)
        return gameId;
    }
  }

  getUserIdFromSocket(socketId: string): number | undefined {
    return this.clientsConnections[socketId].userId
  }

  async findGameById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        uuid: id
      }
    });
    return game;
  }

  async createGame(player1Id: number, player2Id: number): Promise<string> {
    const game = await this.prisma.game.create({
      data: {
        user1_id: player1Id,
        user2_id: player2Id
      }
    });
    return game.uuid;
  }

  async updateGame(uuid: string, updateGameDto: UpdateGameDto) {
    const game = await this.findGameById(uuid);
    if (!game) throw new NotFoundException('Game not found');
    try {
      await this.prisma.game.update({
        where: {
          uuid: uuid
        },
        data: {
          points_user1: updateGameDto.points_user1,
          points_user2: updateGameDto.points_user2,
          status: updateGameDto.status
        }
      });
    } catch (err) {
      throw new ForbiddenException('Could not update game');
    }
  }

  async handleWaitingRoom(client: Socket): Promise<GameState> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: this.clientsConnections[client.id].userId
      }
    });

    if (user) {
      this.waitingRoom.add(client);

      if (this.waitingRoom.size >= 2) {
        const setIterator = this.waitingRoom.values()
        const player1:Socket = setIterator.next().value;
        const player2:Socket = setIterator.next().value;
        const player1Id = this.getUserIdFromSocket(player1.id);
        const player2Id = this.getUserIdFromSocket(player2.id);
        this.waitingRoom.delete(player1)
        this.waitingRoom.delete(player2)
        const game = await this.createGame(player1Id, player2Id);

        const gameState = Object.assign({}, this.initState);
        gameState.player1Id = player1Id;
        gameState.player2Id = player2Id;
        this.games.set(game, gameState);
        return new GameState(game,
          {socket: player1, id: player1Id},
          {socket: player2, id: player2Id},
        );
      }
    }
    return null;
  }

  leaveWaitingRoom(client: Socket) {
    this.waitingRoom.delete(client)
  }

  loop(game: string) {
    const gameState = this.games.get(game);
    gameState.ballX += gameState.velocityX;
    gameState.ballY += gameState.velocityY;
    if (this.checkOutsideCanva(gameState)) {
      gameState.velocityY = -gameState.velocityY;
    } else if (this.checkLeftPadCollision(gameState)) {
      gameState.velocityX = -gameState.velocityX;
      gameState.ballX = gameState.padWallSeparation + gameState.padWidth;
    } else if (this.checkRightPadCollision(gameState)) {
      gameState.velocityX = -gameState.velocityX;
      gameState.ballX =
        gameState.width - gameState.padWallSeparation - gameState.padWidth;
    } else if (gameState.ballX + gameState.ballRadius > gameState.width) {
      gameState.player1Score += 1;
      gameState.ballX = 400;
      gameState.ballY = 150;
      gameState.velocityX = -(Math.random() + 3);
      gameState.velocityY = Math.random() + 3;
    } else if (gameState.ballX - gameState.ballRadius < 0) {
      gameState.player2Score += 1;
      gameState.ballX = 200;
      gameState.ballY = 150;
      gameState.velocityX = Math.random() + 3;
      gameState.velocityY = Math.random() + 3;
    }
    return gameState;
  }

  movePad({ accessToken, gameId, direction }: any) {
    const playerId = JSON.parse(atob(accessToken.split('.')[1])).sub;
    const gameState = this.games.get(gameId);
    if (gameState === undefined) return;

    if (gameState.player1Id !== playerId && gameState.player2Id !== playerId)
      return;

    if (gameState.player1Id === playerId) {
      if (
        direction === 'down' &&
        gameState.leftPad + gameState.padVelocity + gameState.padHeight <
          gameState.height
      )
        gameState.leftPad += gameState.padVelocity;
      else if (
        direction === 'up' &&
        gameState.leftPad - gameState.padVelocity > 0
      )
        gameState.leftPad -= gameState.padVelocity;
    } else if (gameState.player2Id === playerId) {
      if (
        direction === 'down' &&
        gameState.rightPad + gameState.padVelocity + gameState.padHeight <
          gameState.height
      )
        gameState.rightPad += gameState.padVelocity;
      else if (
        direction === 'up' &&
        gameState.rightPad - gameState.padVelocity > 0
      )
        gameState.rightPad -= gameState.padVelocity;
    }
  }

  public registerConnection(id: string, client: Socket, userId: number) {
    // Disable duplicated user - Commented for development
    // this.checkAndRemoveUserConnection(userId)
    this.clientsConnections[id] = {
      socket: client,
      userId
    };
  }

  public unregisterConnection(id: string) {
    delete this.clientsConnections[id];
  }

  private checkOutsideCanva(gameState: IGameData) {
    return (
      gameState.ballY + gameState.ballRadius > gameState.height ||
      gameState.ballY - gameState.ballRadius < 0
    );
  }

  private checkLeftPadCollision(gameState: IGameData): boolean {
    return (
      gameState.ballX + gameState.ballRadius >= gameState.padWallSeparation && // Desde la izquierda
      gameState.ballX - gameState.ballRadius <=
        gameState.padWallSeparation + gameState.padWidth && // Desde la derecha
      gameState.ballY >= gameState.leftPad &&
      gameState.ballY <= gameState.leftPad + gameState.padHeight &&
      gameState.velocityX < 0
    );
  }

  private checkRightPadCollision(gameState: IGameData) {
    return (
      gameState.ballX + gameState.ballRadius >=
        gameState.width - gameState.padWallSeparation - gameState.padWidth && // Desde la izquierda
      gameState.ballX - gameState.ballRadius <=
        gameState.width - gameState.padWallSeparation && // Desde la derecha
      gameState.velocityX > 0 &&
      (gameState.ballY - gameState.ballRadius >= gameState.rightPad ||
        gameState.ballY + gameState.ballRadius >= gameState.rightPad) &&
      (gameState.ballY + gameState.ballRadius <=
        gameState.rightPad + gameState.padHeight ||
        gameState.ballY - gameState.ballRadius <=
          gameState.rightPad + gameState.padHeight)
    );
  }

  private checkAndRemoveUserConnection(userId: number) {
    for (const socketId of Object.keys(this.clientsConnections)) {
      if (this.clientsConnections[socketId].userId === userId)
      {
        this.clientsConnections[socketId].socket.disconnect();
        this.unregisterConnection(socketId)
        break ;
      }
    }
  }
}
