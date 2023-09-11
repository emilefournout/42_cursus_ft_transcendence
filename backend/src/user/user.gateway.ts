import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {JwtService} from '@nestjs/jwt';
import {JwtPayload} from 'src/auth/interface/jwtpayload.dto';
import {UserStatusService} from './user-status.service';

@WebSocketGateway(3003, {
  cors: { origin: '*' },
})
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userStatusService: UserStatusService,
    private jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(_server: Server) {
    console.log('Init UserGateway');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    console.log(client.id + ' is connecting');
    try {
      const token = client.handshake.headers.authentication as string;
      const payload: JwtPayload = this.jwtService.verify(token);
      this.userStatusService.registerConnection(client, payload.sub);
    } catch (error) {
      console.log('Error when verifying token');
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected from ' + client.id);
    this.userStatusService.unregisterConnection(client);
  }
}
