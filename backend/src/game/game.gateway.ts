import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage, WebSocketGateway, WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { GameService } from "./game.service"
import { JwtService } from "@nestjs/jwt"
import { JwtPayload } from "src/auth/interface/jwtpayload.dto"
import { ConfigService } from "@nestjs/config"

@WebSocketGateway(3002, {
    cors: { origin: '*'},
})
export class GameGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor (private gameService: GameService,
        /*private configService: ConfigService,*/
        private jwtService: JwtService) {}
    
    @WebSocketServer()
    server: Server

    afterInit(server: any) {
        console.log('Init GameGateway')
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Connection received from ' + client.id)
        try {
            const token = client.handshake.headers.authentication as string
            const payload: JwtPayload = this.jwtService.verify(token)
            this.gameService.registerConnection(client.id, client, payload.sub)
        } catch (error) {
            console.log('Error when verifying token')
            client.disconnect()
            return ;
        }
        console.log('Connection stablished game.gateway with ' + client.id)
    }

    handleDisconnect(client: Socket) {
        this.gameService.unregisterConnection(client.id)
        console.log('Disconneted from ' + client.id)
    }

    @SubscribeMessage('join_waiting_room')
    async handleJoinWaitingRoom(@ConnectedSocket() client: Socket, @MessageBody() username: string | null) {
        const game = await this.gameService.handleWaitingRoom(client, username)
        const GOALS = 2

        if (game) {
            game.player1.client.join(game.game)
            game.player2.client.join(game.game)
            this.server.to(game.game).emit('game_found', game.game)
            
            const gameLoopInterval = setInterval(() => {
                const gameState = this.gameService.loop(game.game);
                this.server.to(game.game).emit('update', gameState);
                if(gameState.player1Score > GOALS || gameState.player2Score > GOALS){
                    clearInterval(gameLoopInterval);
                    this.server.to(game.game).emit('end',
                        gameState.player1Score > GOALS ? game.player1.user.username : game.player2.user.username
                    );
                    game.player1.client.disconnect();
                    game.player2.client.disconnect();
                }
            }, 10)

            game.player1.client.on('disconnect', () => {
                clearInterval(gameLoopInterval);
                this.server.to(game.game).emit('end', game.player2.user.username);
            });
    
            game.player2.client.on('disconnect', () => {
                clearInterval(gameLoopInterval);
                this.server.to(game.game).emit('end', game.player1.user.username);
            });
        }
    }

    @SubscribeMessage('move_user')
    async handleKeyPressed(client: Socket, @MessageBody() data: any){
        this.gameService.movePad(data)
    }

}
