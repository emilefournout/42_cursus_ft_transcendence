import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage, WebSocketGateway, WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { GameService } from "./game.service"

@WebSocketGateway(3002, {
    cors: { origin: '*'},
})
export class GameGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor (private gameService: GameService) {}
    
    @WebSocketServer()
    server: Server

    afterInit(server: any) {
        console.log('Init GameGateway')
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Connection game.gateway from ' + client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Disconneted from ' + client.id)
    }

    @SubscribeMessage('join_waiting_room')
    async handleJoinWaitingRoom(@ConnectedSocket() client: Socket, @MessageBody() username: string | null) {
        const game = await this.gameService.handleWaitingRoom(client, username)
        if (game) {
            game.player1.client.join(game.game)
            game.player2.client.join(game.game)
            this.server.to(game.game).emit('game_found', game.game)

            setInterval(() => this.server.to(game.game).emit('update', this.gameService.loop(game.game)), 30)
        }
    }

}