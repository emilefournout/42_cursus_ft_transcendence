import {Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {MembershipService} from './membership.service';
import {ChatGateway} from './chat.gateway';
import {UserModule} from 'src/user/user.module';
import {AuthModule} from 'src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService, MembershipService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
