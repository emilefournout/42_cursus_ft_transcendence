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
import { ChatService } from './chat.service';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  afterInit(_server: Server) {
    console.log('Init ChatGateway');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    console.log('Connection from ' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconneted from ' + client.id);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number }
  ) {
    client.join(data.chatId.toString());
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: any) {
    // data -> { chatId: number, userId: number, author: string, message: string}
    // if (!data.chatId || !data.userId || data.message)
    //     return "Message properties invalid"
    const msg = await this.chatService.createChatMessages(
      Number(data.chatId),
      data.userId,
      data.text
    );
    this.server.to(data.chatId.toString()).emit('receive_message', msg);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, @MessageBody() chatId: number) {
    client.leave(chatId.toString());
  }
}
