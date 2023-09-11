import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GameModule } from 'src/game/game.module';
import { UserStatusService } from './user-status.service';
import { UserGateway } from './user.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule), forwardRef(() => GameModule)],
  providers: [UserService, UserStatusService, UserGateway],
  exports: [UserService],
})
export class UserModule {}
