import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [UserModule, ChatModule, GameModule],
  providers: [ChatGateway]
})
export class AppModule {}
