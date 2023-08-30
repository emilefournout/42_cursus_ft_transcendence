import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService, GameState } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interface/jwtpayload.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { ScoreField } from 'src/user/types/scorefield.enum';
import { AchievementService } from 'src/achievement/achievement.service';

@WebSocketGateway(3002, {
  cors: { origin: '*' }
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameService: GameService,
    private userService: UserService,
    /*private configService: ConfigService,*/
    private jwtService: JwtService,
    private achievementsService: AchievementService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Init GameGateway');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Connection received from ' + client.id);
    try {
      const token = client.handshake.headers.authentication as string;
      const payload: JwtPayload = this.jwtService.verify(token);
      this.gameService.registerConnection(client.id, client, payload.sub);
    } catch (error) {
      console.log('Error when verifying token');
      client.disconnect();
      return;
    }
    console.log('Connection stablished with ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.gameService.unregisterConnection(client.id);
    console.log('Disconneted from ' + client.id);
  }
  
  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket) {
    // client.join(uuid);
  }

  @SubscribeMessage('join_active_room')
  async handleJoinActiveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: string | null
  ) {
    // TODO ? -> Check if the user should be able to join the room (uuid, finished game, permissions)
    client.join(uuid);
  }

  @SubscribeMessage('join_waiting_room')
  async handleJoinWaitingRoom(
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.gameService.handleWaitingRoom(client);

    if (game) {
      game.firstPlayer.socket.join(game.id);
      game.secondPlayer.socket.join(game.id);
      this.server.to(game.id).emit('game_found', game.id);
      const gameLoopInterval = setInterval(() => this.gameLoop(game, gameLoopInterval), 10);
      game.firstPlayer.socket.on('disconnect', () => this.disconnectPlayer1(game, gameLoopInterval));
      game.secondPlayer.socket.on('disconnect', () => this.disconnectPlayer2(game, gameLoopInterval));
    }
  }

  @SubscribeMessage('leave_waiting_room')
  handleLeaveWaitingRoom(
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.leaveWaitingRoom(client);
  }

  private async gameLoop(game: GameState, gameLoopInterval: NodeJS.Timer) {
    const gameState = this.gameService.loop(game.id);
    
    this.server.to(game.id).emit('update', gameState);
    if (gameState.player1Score >= gameState.maxGoals
      || gameState.player2Score >= gameState.maxGoals)
    {
      game.finish();
      clearInterval(gameLoopInterval);
      this.server.to(game.id).emit(
          'end',
          gameState.player1Score >= gameState.maxGoals
            ? (await this.userService.findUserById(game.firstPlayer.id)).username
            : (await this.userService.findUserById(game.secondPlayer.id)).username
        );
      //game.player1.client.disconnect(); TODO -> Handle clients disconnections
      //game.player2.client.disconnect();
      const [winner_id, loser_id] = gameState.player1Score > gameState.player2Score
        ? [gameState.player1Id, gameState.player2Id]
        : [gameState.player2Id, gameState.player1Id];
      this.gameService.updateGame(game.id, {
        points_user1: gameState.player1Score,
        points_user2: gameState.player2Score,
        status: 'FINISHED'
      })
        .then(() => this.userService.updateScore(winner_id, ScoreField.Wins))
        .then(() => this.userService.updateScore(loser_id, ScoreField.Loses))
        .then(() => {
          this.achievementsService.checkAndGrantGameAchievements(winner_id);
          this.achievementsService.checkAndGrantGameAchievements(loser_id);
        });
    }
  }

  private async disconnectPlayer2(game:GameState, gameLoopInterval: NodeJS.Timer) {
    if (!game.isFinished) {
      clearInterval(gameLoopInterval);
      this.server.to(game.id).emit('end', (await this.userService.findUserById(game.firstPlayer.id)).username);
      this.gameService.updateGame(game.id, {
        points_user1: game.goalsLimit,
        points_user2: -1,
        status: 'FINISHED'
      })
      .then(() => this.userService.updateScore(game.firstPlayer.id, ScoreField.Wins))
      .then(() => this.userService.updateScore(game.secondPlayer.id, ScoreField.Loses))
      .then(() => {
        this.achievementsService.checkAndGrantGameAchievements(game.firstPlayer.id)
        this.achievementsService.checkAndGrantGameAchievements(game.secondPlayer.id)
      })
    }
  }

  private async disconnectPlayer1(game: GameState, gameLoopInterval: NodeJS.Timer) {
    if (!game.isFinished) {
      clearInterval(gameLoopInterval);
      this.server.to(game.id).emit('end', (await this.userService.findUserById(game.secondPlayer.id)).username);
      this.gameService.updateGame(game.id, {
        points_user1: -1,
        points_user2: game.goalsLimit,
        status: 'FINISHED'
      })
      .then(() => this.userService.updateScore(game.secondPlayer.id, ScoreField.Wins))
      .then(() => this.userService.updateScore(game.firstPlayer.id, ScoreField.Loses))
      .then(() => {
        this.achievementsService.checkAndGrantGameAchievements(game.firstPlayer.id)
        this.achievementsService.checkAndGrantGameAchievements(game.secondPlayer.id)
      })
    }
  }

  @SubscribeMessage('move_user')
  async handleKeyPressed(client: Socket, @MessageBody() data: any) {
    this.gameService.movePad(data);
  }
}
