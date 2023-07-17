import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MembershipService } from './membership.service';
import { UserService } from 'src/user/user.service';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ ChatService, MembershipService, UserService, ChatGateway],
})
export class ChatModule {}
