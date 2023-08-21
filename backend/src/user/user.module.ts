import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';

@Module({
  controllers: [UserController],
  providers: [UserService, GameService],
  imports: [forwardRef(() => GameModule)],
  exports: [UserService]
})
export class UserModule {}
