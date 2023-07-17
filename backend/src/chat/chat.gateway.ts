import {
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage, WebSocketGateway, WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { ChatService } from "./chat.service"

@WebSocketGateway(3001, {
    cors: { origin: '*'},
})
export class ChatGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor (private chatService: ChatService){}
    
    @WebSocketServer()
    server: Server

    afterInit(server: any) {
        console.log('Init ChatGateway')
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Connection from ' + client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Disconneted from ' + client.id)
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(client: Socket, @MessageBody() roomId : number) {
        client.join(roomId.toString())
        return this.chatService.findChatMessagesByIdSortedByDate(roomId);
    }

    @SubscribeMessage('send_message')
    async handleMessage(client: Socket, @MessageBody() data: any) {
        // data -> { roomId: number, userId: number, author: string, message: string}
        if (!data.roomId || !data.userId || data.message)
            return "Message properties invalid"
        this.chatService.createChatMessages(data.roomId, data.userId, data.message)
        data.time = new Date(Date.now());
        this.server.to(data.roomId.toString()).emit('receive_message', data)
    }

    @SubscribeMessage('leave_room')
    handleLeaveRoom(client: Socket, @MessageBody() roomId) {
        client.leave(roomId.toString())
    }
}