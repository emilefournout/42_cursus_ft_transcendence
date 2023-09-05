import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { OnlineStatus } from '@prisma/client';

@Injectable()
export class UserStatusService {
  private currentConnections: Map<Socket, number> = new Map<Socket, number>();
  constructor(private userService: UserService) {}

  registerConnection(client: Socket, userId: number) {
    this.currentConnections.set(client, userId);
    this.userService.setUserStatus(userId, OnlineStatus.ONLINE);
  }

  unregisterConnection(client: Socket) {
    const userId = this.currentConnections.get(client);
    this.currentConnections.delete(client);
    this.userService.setUserStatus(userId, OnlineStatus.OFFLINE);
  }
}
