import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { UserStatusService } from './user-status.service';
import { UserGateway } from './user.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => GameModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserStatusService, UserGateway],
  exports: [UserService]
})
export class UserModule {}
