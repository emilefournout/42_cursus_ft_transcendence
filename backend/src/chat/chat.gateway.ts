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
import { ChatIdDto } from './dto/chat-id.dto';
import { ChatMessageDto } from './dto/chat-message.dto';

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
    @MessageBody() data: ChatIdDto
  ) {
    client.join(data.chatId.toString());
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: ChatMessageDto) {
    const msg = await this.chatService.createChatMessages(
      Number(data.chatId),
      data.userId,
      data.text
    );
    this.server.to(data.chatId.toString()).emit('receive_message', msg);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, @MessageBody() chatId: ChatIdDto) {
    client.leave(chatId.toString());
  }
}
