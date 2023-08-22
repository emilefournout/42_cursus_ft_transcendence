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
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interface/jwtpayload.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

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
    private jwtService: JwtService
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
    console.log('Connection stablished game.gateway with ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.gameService.unregisterConnection(client.id);
    console.log('Disconneted from ' + client.id);
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
    @MessageBody() username: string | null
  ) {
    const game = await this.gameService.handleWaitingRoom(client, username);
    const GOALS = 3;

    if (game) {
      game.player1.client.join(game.game);
      game.player2.client.join(game.game);
      this.server.to(game.game).emit('game_found', game.game);

      const gameLoopInterval = setInterval(() => {
        const gameState = this.gameService.loop(game.game);
        this.server.to(game.game).emit('update', gameState);
        if (
          gameState.player1Score >= GOALS ||
          gameState.player2Score >= GOALS
        ) {
          game.finished = true;
          clearInterval(gameLoopInterval);
          this.server
            .to(game.game)
            .emit(
              'end',
              gameState.player1Score >= GOALS
                ? game.player1.user.username
                : game.player2.user.username
            );
          this.gameService.updateGame(game.game, {
            points_user1: gameState.player1Score,
            points_user2: gameState.player2Score,
            status: 'FINISHED'
          });
          //game.player1.client.disconnect(); TODO -> Handle clients disconnections
          //game.player2.client.disconnect();
        const [winner_id, loser_id] =
            gameState.player1Score > gameState.player2Score
              ? [gameState.player1Id, gameState.player2Id]
              : [gameState.player2Id, gameState.player1Id];
          const [update_wins, update_loses] =
            winner_id === game.player1.user.id
              ? [game.player1.user.wins, game.player2.user.loses]
              : [game.player2.user.wins, game.player1.user.loses];
          this.userService.updateUser(winner_id, { wins: update_wins + 1 });
          this.userService.updateUser(loser_id, { loses: update_loses + 1 });
        }
      }, 10);

      game.player1.client.on('disconnect', () => {
        if (game.finished === false) {
          clearInterval(gameLoopInterval);
          this.server.to(game.game).emit('end', game.player2.user.username);
          this.gameService.updateGame(game.game, {
            points_user1: -1,
            points_user2: GOALS,
            status: 'FINISHED'
          });
          this.userService.updateUser(game.player2.user.id, {
            wins: game.player2.user.wins + 1
          });
          this.userService.updateUser(game.player1.user.id, {
            loses: game.player1.user.loses + 1
          });
        }
      });

      game.player2.client.on('disconnect', () => {
        if (game.finished === false) {
          clearInterval(gameLoopInterval);
          this.server.to(game.game).emit('end', game.player1.user.username);
          this.gameService.updateGame(game.game, {
            points_user1: GOALS,
            points_user2: -1,
            status: 'FINISHED'
          });
          this.userService.updateUser(game.player1.user.id, {
            wins: game.player1.user.wins + 1
          });
          this.userService.updateUser(game.player2.user.id, {
            loses: game.player2.user.loses + 1
          });
        }
      });
    }
  }

  @SubscribeMessage('move_user')
  async handleKeyPressed(client: Socket, @MessageBody() data: any) {
    this.gameService.movePad(data);
  }
}
