import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameData, GameDataOptions } from './types/game-info.class';
import { Socket } from 'socket.io';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameState } from './types/game-state.class';
import { ConnectionStorage } from './types/connection-storage.class';

@Injectable()
export class GameService {
  private userConnections = new ConnectionStorage();
  private waitingRoom: Set<Socket> = new Set<Socket>();
  private createdRoom: Map<Socket, GameDataOptions> = new Map<Socket, GameDataOptions>();
  private privateRoom: Map<Socket, GameDataOptions> = new Map<Socket, GameDataOptions>();
  private games: Map<string, GameData> = new Map<string, GameData>();

  constructor(private prisma: PrismaService) {}

  async findGameById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        uuid: id
      }
    });
    return game;
  }

  findActiveGames(): string[] {
    return Array.from(this.games.keys());
  }

  findActiveGameByUserId(userId: number): string | undefined {
    for (const [gameId, gameData] of this.games.entries()) {
      if (gameData.firstPlayerId == userId
        || gameData.secondPlayerId == userId)
        return gameId;
    }
  }

  getUserIdFromSocket(socket: Socket): number | undefined {
    return this.userConnections.getUserIdFromSocket(socket)
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

  customizeGame(client: Socket, gameOptions: GameDataOptions) {
    this.createdRoom.set(client, gameOptions)
  }

  async handleWaitingRoom(): Promise<GameState> {
    let player1 : Socket,  player2 : Socket;
    let gameOptions: GameDataOptions;
    
    if (this.waitingRoom.size >= 1 && this.createdRoom.size >= 1) {
      const gameRoom = this.peekGameFromCreatedRoom();
      player1 = gameRoom.player;
      gameOptions = gameRoom.gameOptions;
      player2 = this.peekPlayerFromWaitingRoom();
    }
    else if (this.waitingRoom.size >= 2)
    {
      player1 = this.peekPlayerFromWaitingRoom();
      player2 = this.peekPlayerFromWaitingRoom();
    }
    if (player1 && player2) {
      const player1Id: number = this.getUserIdFromSocket(player1);
      const player2Id: number = this.getUserIdFromSocket(player2);
      const game = await this.createGame(player1Id, player2Id);
      const gameData = new GameData(player1Id, player2Id, gameOptions)
      this.games.set(game, gameData);
      return new GameState(game,
        {socket: player1, id: player1Id},
        {socket: player2, id: player2Id},
      );
    }
  }

  private peekPlayerFromWaitingRoom() {
    const setIterator = this.waitingRoom.values();
    const player: Socket = setIterator.next().value;
    this.waitingRoom.delete(player);
    return player;
  }

  private peekGameFromCreatedRoom() : {player: Socket, gameOptions: GameDataOptions}{
    const setIterator = this.createdRoom.keys();
    const player: Socket = setIterator.next().value;
    const gameOptions = this.createdRoom.get(player)
    this.createdRoom.delete(player);
    return {player, gameOptions};
  }

  addToWaitingRoom(client: Socket) {
    this.waitingRoom.add(client)
  }

  leaveWaitingRoom(client: Socket) {
    this.waitingRoom.delete(client)
  }

  updateGameState(gameId: string) : GameData {
    const gameInfo = this.games.get(gameId);
    gameInfo.updateBall()
    return gameInfo;
  }

  movePad(socket: Socket, gameId: string, direction: string) {
    const playerId = this.getUserIdFromSocket(socket)
    const gameState = this.games.get(gameId);
    if (gameState === undefined) return;

    if (gameState.firstPlayerId !== playerId && gameState.secondPlayerId !== playerId)
      return;

    gameState.move(direction, playerId)
  }

  public registerConnection(client: Socket, userId: number) {
    // Disable duplicated user - Commented for development
    // this.disconnectPreviousConnection(userId);
    this.userConnections.addUser(client, userId)
  }

  private disconnectPreviousConnection(userId: number) {
    const previousSocket = this.userConnections.removeUserByUserId(userId);
    if (previousSocket !== undefined) {
      previousSocket.disconnect();
    }
  }

  public unregisterConnection(socket: Socket) {
    this.userConnections.removeUserBySocket(socket)
    this.createdRoom.delete(socket)
    this.waitingRoom.delete(socket)
  }

  public debug_room_status() {
    console.log("Waiting room: ", this.waitingRoom.size)
    console.log("Created room: ", this.createdRoom.size)
  }
}

