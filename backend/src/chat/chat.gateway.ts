import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage, WebSocketGateway, WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"


@WebSocketGateway(3001, {
    cors: { origin: '*'},
})
export class ChatGateway 
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    afterInit(server: any) {
        // console.log('Init ChatGateway')
    }

    handleConnection(client: any, ...args: any[]) {
        // console.log('Connection')
    }

    handleDisconnect(client: any) {
        // console.log('Disconneted')
    }

    @WebSocketServer()
    server: Server

    @SubscribeMessage('join_room')
    handleJoinRoom(client, room) {
        // console.log('Join', room)
        client.join(room)
    }

    @SubscribeMessage('send_message')
    handleMessage(client: Socket, data) {
        // console.log('Message', data)
        this.server.to(data.room).emit('receive_message', data)
    }
}