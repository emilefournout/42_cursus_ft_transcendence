import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interface/jwtpayload.dto';
import { UserService } from 'src/user/user.service';
import { ScoreField } from 'src/user/types/scorefield.enum';
import { AchievementService } from 'src/achievement/achievement.service';
import { GameState } from './types/game-state.class';
import { GameData } from './types/game-data.class';
import { CreateGameDto, CreatePrivateGameDto } from './dto/create-game.dto';
import { OnlineStatus } from '@prisma/client';
import { GameIdDto } from './dto/game-id.dto';
import { GameMoveDto } from './dto/game-move.dto';
import { UserIdDto } from '../user/dto/user-id.dto';

@WebSocketGateway(3002, {
  cors: { origin: '*' },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameService: GameService,
    private userService: UserService,
    private jwtService: JwtService,
    private achievementsService: AchievementService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(_server: Server) {
    console.log('Init GameGateway');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    console.log('Connection received from ' + client.id);
    try {
      const token = client.handshake.headers.authentication as string;
      const payload: JwtPayload = this.jwtService.verify(token);
      this.gameService.registerConnection(client, payload.sub);
    } catch (error) {
      console.log('Error when verifying token');
      client.disconnect();
      return;
    }
    console.log('Connection stablished with ' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconneted from ' + client.id);
    this.gameService.unregisterConnection(client);
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameDataOptions: CreateGameDto
  ) {
    const active_game = await this.gameService.isUserInGame(client);
    console.log(`Active game is: ${active_game}`)
    if (active_game)
      return 'ko';
    console.log('Customizing a game ' + client.id);
    console.log(`Customizing options ${JSON.stringify(gameDataOptions)}`);
    this.gameService.customizeGame(client, gameDataOptions);
    const game = await this.gameService.handleWaitingRoom();
    if (game) {
      await this.initGame(game);
    }
    return 'ok';
  }

  @SubscribeMessage('create_private_room')
  async handleCreatePrivateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() privateGameDataOptions: CreatePrivateGameDto
  ) {
    const active_game = await this.gameService.isUserInGame(client);
    console.log(`Active game is: ${active_game}`)
    if (active_game)
      return 'ko';
    console.log('Creating private game ' + client.id);
    const userId = this.gameService.getUserIdFromSocket(client);
    const invited = await this.userService.findUserByFilter({
      username: privateGameDataOptions.friendUserName,
    });
    if (!invited || userId === invited.id) {
      console.log('Not a friend');
      return 'ko';
    }
    this.gameService.createPrivateRoom(
      client,
      privateGameDataOptions.gameDto,
      invited.id
    );
    return 'ok';
  }

  @SubscribeMessage('join_private_room')
  async handleJoinPrivateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() friendDto: UserIdDto
  ) {
    console.log('Joining private game ' + client.id);
    const game = await this.gameService.joinPrivateRoom(
      client,
      friendDto.userId
    );
    if (game) {
      await this.initGame(game);
    }
  }

  private async initGame(game: GameState) {
    await Promise.all([
      this.userService.setUserStatus(game.firstPlayer.id, OnlineStatus.PLAYING),
      this.userService.setUserStatus(
        game.secondPlayer.id,
        OnlineStatus.PLAYING
      ),
    ]);
    game.firstPlayer.socket.join(game.id);
    game.secondPlayer.socket.join(game.id);
    this.server.to(game.id).emit('game_found', game.id);
    const gameLoopInterval = setInterval(
      () => this.gameLoop(game, gameLoopInterval),
      10
    );
    game.firstPlayer.socket.on('disconnect', () =>
      this.disconnectPlayer(game, gameLoopInterval, 1)
    );
    game.secondPlayer.socket.on('disconnect', () =>
      this.disconnectPlayer(game, gameLoopInterval, 2)
    );
  }

  @SubscribeMessage('leave_private_room')
  async handleLeavePrivateRoom(@ConnectedSocket() client: Socket) {
    console.log('Leaving private game ' + client.id);
    this.gameService.leaveInvitationRoom(client);
  }

  @SubscribeMessage('join_active_room')
  async handleJoinActiveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: GameIdDto
  ) {
    client.join(uuid.gameId);
  }

  @SubscribeMessage('join_waiting_room')
  async handleJoinWaitingRoom(@ConnectedSocket() client: Socket) {
    const active_game = await this.gameService.isUserInGame(client);
    if (active_game)
      return {status: 'ko', uuid: active_game};
    console.log('Joining waiting room ', client.id);
    this.gameService.addToWaitingRoom(client);
    const game = await this.gameService.handleWaitingRoom();
    if (game) {
      await this.initGame(game);
    }
    return {status: 'ok', uuid: null};
  }

  @SubscribeMessage('move_user')
  async handleKeyPressed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GameMoveDto
  ) {
    this.gameService.movePad(client, data.gameId, data.direction);
  }

  @SubscribeMessage('leave_waiting_room')
  handleLeaveWaitingRoom(@ConnectedSocket() client: Socket) {
    console.log('Leaving waiting room', client.id);
    this.gameService.leaveWaitingRoom(client);
  }

  @SubscribeMessage('leave_creating_room')
  handleLeaveCreatingRoom(@ConnectedSocket() client: Socket) {
    console.log('Leaving creating room', client.id);
    this.gameService.leaveCreatingRoom(client);
  }

  private async gameLoop(game: GameState, gameLoopInterval: NodeJS.Timer) {
    const gameState: GameData = this.gameService.updateGameState(game.id);
    this.server.to(game.id).emit('update', gameState);
    if (gameState.isFinished) {
      this.finishGame(game, gameLoopInterval);
    }
  }

  private async disconnectPlayer(
    game: GameState,
    gameLoopInterval: NodeJS.Timer,
    playerNumber: 1 | 2
  ) {
    game.disconnectPlayer(playerNumber);
    await this.finishGame(game, gameLoopInterval);
  }

  private async finishGame(
    gameState: GameState,
    gameLoopInterval: NodeJS.Timer
  ) {
    clearInterval(gameLoopInterval);
    const winnerUser = await this.userService.findUserByFilter({
      id: gameState.winnerId,
    });
    this.gameService.removeActiveGame(gameState.id);
    this.server.to(gameState.id).emit('end', winnerUser.username);
    await Promise.all([
      this.gameService.updateGame(gameState.id, {
        points_user1: gameState.firstPlayerScore,
        points_user2: gameState.secondPlayerScore,
        status: 'FINISHED',
      }),
      this.userService.updateScore(gameState.winnerId, ScoreField.Wins),
      this.userService.updateScore(gameState.loserId, ScoreField.Loses),
      this.userService.setUserStatusBackToOnline(gameState.firstPlayer.id),
      this.userService.setUserStatusBackToOnline(gameState.secondPlayer.id),
    ]);
    await this.achievementsService.checkAndGrantGameAchievements(gameState);
  }
}
