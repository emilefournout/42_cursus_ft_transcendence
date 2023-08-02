import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGameData } from './game.interface';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';

@Injectable()
export class GameService {
  private waitingRoom: Array<{client: Socket, user: User}> = []
  private games = new Map<string, IGameData>()

  constructor(
    private prisma: PrismaService,
  ) {}

  initState: IGameData = {
    width: 600,
    height: 350,
    padWidth: 10,
    padHeight: 60,
    ballRadius: 8,
    leftPad: 0,
    rightPad: 150,
    ballX: 200,
    ballY: 150,
    velocityX: Math.random() * 3 + 10,
    velocityY: Math.random() * 3 + 10,
    padWallSeparation: 20,
  }

  async findGameById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        uuid: id,
      }
    })
    return game;
  }

  async createGame(player1Id: number, player2Id: number) : Promise<string> {
    const game = await this.prisma.game.create({
      data: {
        users: {
            connect: [
              {id: player1Id},
              {id: player2Id},
            ]
          }
        }
    });
    return game.uuid;
  }

  async handleWaitingRoom(client: Socket, username: string | null) {
    const user = await this.prisma.user.findFirst({
      where: { username: username }
    })
    if (user) {
      this.waitingRoom.push({ client, user})

      if (this.waitingRoom.length >= 2) {
        const player1 = this.waitingRoom.shift()
        const player2 = this.waitingRoom.shift()
        const game = await this.createGame(player1.user.id, player2.user.id)

        const gameState = Object.assign({}, this.initState)
        this.games.set(game, gameState)
        return { game, player1, player2 }
      }
    }
    return null
  }

  loop(game: string) {
    const gameState = this.games.get(game)
    gameState.ballX += gameState.velocityX
    gameState.ballY += gameState.velocityY
    if (this.checkOutsideCanva(gameState)) {
      gameState.velocityY = -gameState.velocityY
    } else if (this.checkLeftPadCollision(gameState)) {
      gameState.velocityX = -gameState.velocityX
      gameState.ballX = gameState.padWallSeparation + gameState.padWidth;
    } else if (this.checkRightPadCollision(gameState)) {
      gameState.velocityX = -gameState.velocityX
      gameState.ballX = gameState.width - gameState.padWallSeparation - gameState.padWidth;;
    } else if (gameState.ballX + gameState.ballRadius > gameState.width) {
      // TODO Add points to winner
      gameState.ballX = 400;
      gameState.ballY = 150;
      gameState.velocityX = -(Math.random() * 3 + 10)
      gameState.velocityY = Math.random() * 3 + 10
    } else if (gameState.ballX - gameState.ballRadius < 0) {
      gameState.ballX = 200;
      gameState.ballY = 150;
      gameState.velocityX = Math.random() * 3 + 10
      gameState.velocityY = Math.random() * 3 + 10
    }
    return gameState
  }

  private checkOutsideCanva(gameState: IGameData) {
    return gameState.ballY + gameState.ballRadius > gameState.height
      || gameState.ballY - gameState.ballRadius < 0;
  }
  
    private checkLeftPadCollision(gameState: IGameData): boolean {
      return (gameState.ballX + gameState.ballRadius >= gameState.padWallSeparation // Desde la izquierda
        && gameState.ballX  - gameState.ballRadius <= gameState.padWallSeparation + gameState.padWidth  // Desde la derecha
        && gameState.ballY >= gameState.leftPad
        && gameState.ballY <= gameState.leftPad + gameState.padHeight);
    }

  private checkRightPadCollision(gameState: IGameData) {
    return (gameState.ballX + gameState.ballRadius >= gameState.width - gameState.padWallSeparation - gameState.padWidth // Desde la izquierda
      && gameState.ballX - gameState.ballRadius <= gameState.width - gameState.padWallSeparation // Desde la derecha
      && (gameState.ballY - gameState.ballRadius >= gameState.rightPad
        || gameState.ballY + gameState.ballRadius >= gameState.rightPad)
      && (gameState.ballY + gameState.ballRadius <= gameState.rightPad + gameState.padHeight
        || gameState.ballY - gameState.ballRadius <= gameState.rightPad + gameState.padHeight));
  }
}
