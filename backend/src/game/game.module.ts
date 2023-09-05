import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AchievementsModule } from 'src/achievement/achievement.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AchievementsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [GameService, GameGateway],
  controllers: [GameController],
  exports: [GameService]
})
export class GameModule {}
