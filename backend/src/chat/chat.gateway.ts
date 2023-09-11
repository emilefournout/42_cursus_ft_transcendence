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
import {Server, Socket} from 'socket.io';
import {ChatService} from './chat.service';
import {ChatIdDto} from './dto/chat-id.dto';
import {ChatMessageDto} from './dto/chat-message.dto';
import {MembershipService} from './membership.service';
import {ConnectionStorage} from 'src/game/types/connection-storage.class';
import {JwtPayload} from 'src/auth/interface';
import {JwtService} from '@nestjs/jwt';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private userConnections = new ConnectionStorage();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private membershipService: MembershipService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(_server: Server) {
    console.log('Init ChatGateway');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    console.log('Connection from ' + client.id);
    try {
      const token = client.handshake.headers.authentication as string;
      const payload: JwtPayload = this.jwtService.verify(token);
      this.userConnections.addUser(client, payload.sub);
    } catch (error) {
      console.log('Error when verifying token');
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected from ' + client.id);
    this.userConnections.removeUserBySocket(client);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatIdDto
  ) {
    client.join(data.chatId.toString());
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto
  ) {
    const userId = this.userConnections.getUserIdFromSocket(client);
    if (userId === undefined) return;
    if (
      !(await this.membershipService.isUserAllowedToTextOnChat(
        this.userConnections.getUserIdFromSocket(client),
        data.chatId
      ))
    )
      return 'ko';
    const msg = await this.chatService.createChatMessages(
      data.chatId,
      userId,
      data.text
    );
    this.server.to(data.chatId.toString()).emit('receive_message', msg);
    return 'ok';
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, @MessageBody() chatIdDto: ChatIdDto) {
    client.leave(chatIdDto.chatId.toString());
  }
}
